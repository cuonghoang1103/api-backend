package com.cuongthai.mgo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("donSpring")
public record DonHang(@Id String id, String sanPham, int soLuong) {}
