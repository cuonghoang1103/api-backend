package com.cuongthai.mgo;

import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

/** Bài 8.4 — một sản phẩm: giá tiền BigDecimal, auditing (@CreatedDate/@LastModifiedDate) và khoá lạc quan (@Version). */
@Document("spSpring")
public class SanPham {
  @Id public String id;
  public String ten;
  public BigDecimal gia;
  @Version public Long version;
  @CreatedDate public Instant taoLuc;
  @LastModifiedDate public Instant suaLuc;

  public SanPham() {}
  public SanPham(String id, String ten, String gia) { this.id = id; this.ten = ten; this.gia = new BigDecimal(gia); }
}
