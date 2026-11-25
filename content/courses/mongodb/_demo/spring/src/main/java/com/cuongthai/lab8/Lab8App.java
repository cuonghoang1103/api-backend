package com.cuongthai.lab8;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.mongodb.MongoException;
import org.bson.types.ObjectId;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.*;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/**
 * Lab 8.5 — LỜI GIẢI bản Spring Boot 4.1 + Spring Data MongoDB 5.1 (cùng hợp đồng API với lab8-express.mjs).
 * Chạy: ./chay-lab8.sh   (cổng 47082, database lab8)
 */
@SpringBootApplication
public class Lab8App {
  public static void main(String[] a) { SpringApplication.run(Lab8App.class, a); }

  /** Không có bean này thì @Transactional không bao MongoDB (Bài 8.4). */
  @Bean MongoTransactionManager transactionManager(MongoDatabaseFactory f) { return new MongoTransactionManager(f); }

  @Document("sp") public record SP(@Id String id, String ten, BigDecimal gia, int ton) {}
  @Document("don") public record Don(@Id ObjectId id, String khach, List<Dong> items, BigDecimal tong, Instant taoLuc) {}
  public record Dong(String sp, int sl, BigDecimal gia) {}
  public record DongVao(Object sp, Object sl) {}                          // Object: tự kiểm kiểu, không để Jackson ép "2" thành 2
  public record DonVao(Object khach, List<DongVao> items) {}
  public record KhachVao(Object sdt, Object v) {}

  public static class LoiHttp extends RuntimeException {
    final HttpStatus status; final Map<String, Object> body;
    LoiHttp(HttpStatus s, Map<String, Object> b) { super(String.valueOf(b.get("loi"))); status = s; body = b; }
  }

  @Service public static class DonService {
    private final MongoTemplate mongo;
    DonService(MongoTemplate mongo) { this.mongo = mongo; }

    @Transactional
    public Don datHang(String khach, List<Dong> vao) {
      var dong = new ArrayList<Dong>(); var tong = BigDecimal.ZERO;
      for (var d : vao) {
        var s = mongo.findAndModify(Query.query(Criteria.where("_id").is(d.sp()).and("ton").gte(d.sl())),
            new Update().inc("ton", -d.sl()), FindAndModifyOptions.options().returnNew(true), SP.class);
        if (s == null) throw new LoiHttp(HttpStatus.CONFLICT, Map.of("loi", "het-hang", "sp", d.sp()));
        dong.add(new Dong(d.sp(), d.sl(), s.gia())); tong = tong.add(s.gia().multiply(BigDecimal.valueOf(d.sl())));
      }
      return mongo.insert(new Don(null, khach, dong, tong, Instant.now()));
    }
  }

  @RestController public static class Api {
    private final MongoTemplate mongo; private final DonService don;
    static final AtomicInteger THU_LAI = new AtomicInteger();
    static final boolean KHONG_THU_LAI = Boolean.getBoolean("lab8.khongThuLai");   // -Dlab8.khongThuLai=true để thấy điều gì xảy ra
    Api(MongoTemplate mongo, DonService don) { this.mongo = mongo; this.don = don; }

    static boolean nguyenDuong(Object x) { return x instanceof Integer i && i > 0 && i <= 1000; }

    @GetMapping("/sp/{ma}") Map<String, Object> sp(@PathVariable String ma) {
      var s = mongo.findById(ma, SP.class);
      if (s == null) throw new LoiHttp(HttpStatus.NOT_FOUND, Map.of("loi", "khong-co"));
      return Map.of("ma", s.id(), "ten", s.ten(), "gia", s.gia().toPlainString(), "ton", s.ton());
    }

    @PostMapping("/don") ResponseEntity<Map<String, Object>> datHang(@RequestBody DonVao v) {
      if (!(v.khach() instanceof String k) || v.items() == null || v.items().isEmpty() || v.items().size() > 20
          || !v.items().stream().allMatch(d -> d != null && d.sp() instanceof String && nguyenDuong(d.sl())))
        throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "du-lieu-sai"));
      var dong = v.items().stream().map(d -> new Dong((String) d.sp(), (Integer) d.sl(), null)).toList();
      for (int lan = 1; ; lan++) {                       // @Transactional KHÔNG tự thử lại WriteConflict — phải tự làm
        try {
          var d = don.datHang(k, dong);
          return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", d.id().toHexString(), "tong", d.tong().toPlainString()));
        } catch (DataAccessException e) {
          if (!KHONG_THU_LAI && lan < 20 && e.getMostSpecificCause() instanceof MongoException m && m.hasErrorLabel(MongoException.TRANSIENT_TRANSACTION_ERROR_LABEL)) {
            THU_LAI.incrementAndGet(); continue;
          }
          throw e;
        }
      }
    }

    @GetMapping("/don/{id}") Map<String, Object> xemDon(@PathVariable String id) {
      if (!ObjectId.isValid(id)) throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "id-sai"));
      var d = mongo.findById(new ObjectId(id), Don.class);
      if (d == null) throw new LoiHttp(HttpStatus.NOT_FOUND, Map.of("loi", "khong-co"));
      return Map.of("id", id, "khach", d.khach(), "tong", d.tong().toPlainString(),
          "items", d.items().stream().map(x -> Map.of("sp", x.sp(), "sl", x.sl(), "gia", x.gia().toPlainString())).toList());
    }

    @PatchMapping("/khach/{id}") Map<String, Object> suaKhach(@PathVariable String id, @RequestBody KhachVao v) {
      if (!(v.sdt() instanceof String sdt) || !(v.v() instanceof Integer ver)) throw new LoiHttp(HttpStatus.BAD_REQUEST, Map.of("loi", "du-lieu-sai"));
      var r = mongo.updateFirst(Query.query(Criteria.where("_id").is(id).and("v").is(ver)), new Update().set("sdt", sdt).inc("v", 1), "khach");
      if (r.getMatchedCount() == 0) throw new LoiHttp(HttpStatus.CONFLICT, Map.of("loi", "da-bi-sua"));
      return Map.of("v", ver + 1);
    }

    @GetMapping("/thu-lai") Map<String, Object> thuLai() { return Map.of("thuLai", THU_LAI.get()); }

    @ExceptionHandler(LoiHttp.class) ResponseEntity<Map<String, Object>> loi(LoiHttp e) { return ResponseEntity.status(e.status).body(e.body); }
  }
}
