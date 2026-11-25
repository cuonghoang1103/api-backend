package com.cuongthai.mgo;

import java.util.*;
import java.util.stream.*;
import org.bson.Document;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.*;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.query.*;

/**
 * Bài 8.4 — các thí nghiệm Spring Data MongoDB "sau phần cơ bản". Chạy một thí nghiệm:
 *   java -jar mgo-spring.jar <decimal|tx|bulk|audit> [--thuộc-tính=giá-trị …]     (hoặc mvn -q spring-boot:run -Dspring-boot.run.arguments=…)
 */
@SpringBootApplication
public class App {
  public static void main(String[] a) { SpringApplication.run(App.class, a); }

  @Bean CommandLineRunner chay(MongoTemplate mongo, SanPhamRepo repo, DatHangService dh, ApplicationArguments args) {
    return a -> {
      switch (args.getNonOptionArgs().get(0)) {
        case "decimal" -> decimal(mongo, repo);
        case "tx" -> tx(mongo, dh);
        case "bulk" -> bulk(mongo, repo);
        case "audit" -> audit(mongo, repo);
        case "lo" -> lo(mongo, repo);
      }
    };
  }

  static String raw(MongoTemplate mongo, String coll, String id) {
    var d = mongo.getCollection(coll).find(new Document("_id", id)).first();
    return d.toJson().replaceAll("\\s+", " ");
  }

  /** Như raw() nhưng bỏ các trường auditing/_class cho gọn. */
  static String gon(MongoTemplate mongo, String coll, String id) {
    var d = mongo.getCollection(coll).find(new Document("_id", id)).projection(new Document("taoLuc", 0).append("suaLuc", 0).append("_class", 0)).first();
    return d.toJson().replaceAll("\\s+", " ");
  }

  /** BigDecimal được lưu thành kiểu gì, và sắp xếp theo giá có đúng không. */
  static void decimal(MongoTemplate mongo, SanPhamRepo repo) {
    repo.deleteAll();
    repo.saveAll(List.of(new SanPham("A", "Áo thun", "99000"), new SanPham("B", "Quần jean", "450000"), new SanPham("C", "Tất", "25000.50")));
    var kieu = mongo.getCollection("spSpring").aggregate(List.of(new Document("$project", new Document("t", new Document("$type", "$gia"))))).first().getString("t");
    System.out.println("gia trong MongoDB có kiểu: " + kieu + " | tài liệu B: " + raw(mongo, "spSpring", "B"));
    System.out.println("findAllByOrderByGiaAsc(): " + repo.findAllByOrderByGiaAsc().stream().map(s -> s.ten + " " + s.gia.toPlainString()).collect(Collectors.joining(" < ")));
    var dem = mongo.count(Query.query(Criteria.where("gia").gt(new java.math.BigDecimal("100000"))), SanPham.class);
    System.out.println("count(gia > 100000) = " + dem);
  }

  /** @Transactional có hoàn tác được ghi MongoDB không. */
  static void tx(MongoTemplate mongo, DatHangService dh) {
    mongo.dropCollection("donSpring"); mongo.dropCollection("khoSpring");
    mongo.createCollection("donSpring"); mongo.createCollection("khoSpring");
    mongo.getCollection("khoSpring").insertOne(new Document("_id", "SP017").append("ton", 3));
    for (var d : List.of(List.of("D1", 2), List.of("D2", 2), List.of("D3", 1))) {
      try { dh.datHang((String) d.get(0), "SP017", (Integer) d.get(1)); System.out.print(d.get(0) + ": đã đặt | "); }
      catch (RuntimeException e) { System.out.print(d.get(0) + ": lỗi (" + e.getMessage() + ") | "); }
    }
    System.out.println();
    System.out.println("tồn kho " + mongo.getCollection("khoSpring").find().first().get("ton") + " | đơn trong DB: "
        + mongo.findAll(DonHang.class).stream().map(DonHang::id).collect(Collectors.joining(", ")));
  }

  /** Ghi 20.000 sản phẩm ba cách, rồi sửa giá cả 20.000 hai cách; đếm lệnh driver gửi đi. */
  static void bulk(MongoTemplate mongo, SanPhamRepo repo) {
    var ds = IntStream.range(0, 20000).mapToObj(i -> new SanPham("SP" + i, "Hàng " + i, String.valueOf(1000 + i))).toList();
    record Cach(String ten, Runnable f) {}
    var cach = List.of(
        new Cach("repo.saveAll(20.000 mới)", () -> repo.saveAll(ds)),
        new Cach("mongo.insertAll(20.000)", () -> mongo.insertAll(ds)),
        new Cach("bulkOps UNORDERED insert(20.000)", () -> mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, SanPham.class).insert(ds).execute()));
    for (int lan = 0; lan < 2; lan++)                       // lượt 0 chỉ để JVM "nóng máy" (JIT), lượt 1 mới in
      for (var c : cach) {
        mongo.dropCollection(SanPham.class);
        ds.forEach(s -> { s.version = null; s.taoLuc = null; s.suaLuc = null; });
        CauHinh.LENH.clear();
        long t = System.nanoTime(); c.f().run(); long ms = (System.nanoTime() - t) / 1_000_000;
        if (lan == 1) System.out.printf("%-36s %6d ms, %6d tài liệu, lệnh gửi: %s%n", c.ten(), ms, mongo.count(new Query(), SanPham.class), lenh());
      }
    // Bẫy: bulkOps.insert không khởi tạo @Version ⇒ tài liệu thiếu trường version ⇒ save() sau đó tưởng là tài liệu MỚI
    var sp0 = repo.findById("SP0").get();
    System.out.println("SP0 do bulkOps ghi: version = " + sp0.version + " | " + gon(mongo, "spSpring", "SP0"));
    sp0.gia = new java.math.BigDecimal("999");
    try { repo.save(sp0); } catch (DuplicateKeyException e) { System.out.println("repo.save(SP0 sửa giá) ⇒ " + e.getClass().getSimpleName() + " (Spring gửi insert vì version null)"); }
    // Sửa giá cả 20.000 mã. Cách 1: đọc hết, sửa trong Java, saveAll. Cách 2: một lô updateOne.
    mongo.dropCollection(SanPham.class);
    ds.forEach(s -> { s.version = null; s.taoLuc = null; s.suaLuc = null; });
    repo.saveAll(ds);
    var tatCa = repo.findAll();
    tatCa.forEach(s -> s.gia = s.gia.add(java.math.BigDecimal.ONE));
    CauHinh.LENH.clear();
    long t = System.nanoTime(); repo.saveAll(tatCa);
    System.out.printf("%-36s %6d ms, lệnh gửi: %s%n", "repo.saveAll(20.000 đã có) — sửa giá", (System.nanoTime() - t) / 1_000_000, lenh());
    CauHinh.LENH.clear();
    t = System.nanoTime();
    var ops = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, SanPham.class);
    for (int i = 0; i < 20000; i++) ops.updateOne(Query.query(Criteria.where("_id").is("SP" + i)), new Update().inc("gia", java.math.BigDecimal.ONE).inc("version", 1));
    var kq = ops.execute();
    System.out.printf("%-36s %6d ms, sửa %d tài liệu, lệnh gửi: %s%n", "bulkOps 20.000 updateOne — sửa giá", (System.nanoTime() - t) / 1_000_000, kq.getModifiedCount(), lenh());
    System.out.println("SP0 sau hai lần sửa: " + gon(mongo, "spSpring", "SP0"));
  }

  /** Thực hành 3: 20.000 updateOne chia lô 2.000. */
  static void lo(MongoTemplate mongo, SanPhamRepo repo) {
    mongo.dropCollection(SanPham.class);
    repo.saveAll(IntStream.range(0, 20000).mapToObj(i -> new SanPham("SP" + i, "Hàng " + i, String.valueOf(1000 + i))).toList());
    CauHinh.LENH.clear();
    long t = System.nanoTime();
    for (int lo = 0; lo < 10; lo++) {
      var ops = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, SanPham.class);
      for (int i = lo * 2000; i < (lo + 1) * 2000; i++) ops.updateOne(Query.query(Criteria.where("_id").is("SP" + i)), new Update().inc("gia", java.math.BigDecimal.ONE).inc("version", 1));
      ops.execute();
    }
    System.out.printf("10 lô × 2.000 updateOne: %d ms, lệnh gửi: %s%n", (System.nanoTime() - t) / 1_000_000, lenh());
  }

  static String lenh() {
    return CauHinh.LENH.entrySet().stream().filter(e -> !Set.of("hello", "isMaster", "endSessions").contains(e.getKey()))
        .map(e -> e.getValue() + " " + e.getKey()).sorted().collect(Collectors.joining(" + "));
  }

  /** Auditing tự điền thời điểm; @Version chặn ghi đè bằng bản cũ. */
  static void audit(MongoTemplate mongo, SanPhamRepo repo) throws Exception {
    repo.deleteAll();
    var a = repo.save(new SanPham("A", "Áo thun", "99000"));
    System.out.println("sau save lần 1: " + raw(mongo, "spSpring", "A"));
    Thread.sleep(50);
    var tab1 = repo.findById("A").get();
    var tab2 = repo.findById("A").get();
    tab1.gia = new java.math.BigDecimal("89000"); repo.save(tab1);
    System.out.println("tab 1 lưu giá mới: " + raw(mongo, "spSpring", "A"));
    tab2.ten = "Áo thun cổ tròn";
    try { repo.save(tab2); System.out.println("tab 2 lưu được (mất giá mới!)"); }
    catch (OptimisticLockingFailureException e) { System.out.println("tab 2 bị chặn: " + e.getClass().getSimpleName() + " — " + e.getMessage()); }
    try { repo.save(new SanPham("A", "Áo giả", "1")); }
    catch (DuplicateKeyException e) { System.out.println("tạo mới trùng _id: " + e.getClass().getSimpleName()); }
  }
}
