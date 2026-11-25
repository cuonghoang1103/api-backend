package com.cuongthai.mgo;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SanPhamRepo extends MongoRepository<SanPham, String> {
  List<SanPham> findAllByOrderByGiaAsc();
}
