package com.cuongthai.mgo;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Bài 8.4 — ghi đơn rồi trừ kho; hết hàng ⇒ ném lỗi và mong mọi thứ được hoàn tác. */
@Service
public class DatHangService {
  private final MongoTemplate mongo;
  public DatHangService(MongoTemplate mongo) { this.mongo = mongo; }

  @Transactional
  public void datHang(String maDon, String sp, int sl) {
    mongo.insert(new DonHang(maDon, sp, sl));
    var r = mongo.updateFirst(Query.query(Criteria.where("_id").is(sp).and("ton").gte(sl)), new Update().inc("ton", -sl), "khoSpring");
    if (r.getModifiedCount() == 0) throw new IllegalStateException("hết hàng " + sp);
  }
}
