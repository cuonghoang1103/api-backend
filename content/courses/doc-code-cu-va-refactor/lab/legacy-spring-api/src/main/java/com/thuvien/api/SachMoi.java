package com.thuvien.api;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

/** Dữ liệu tạo sách mới (POST /api/sach). */
public class SachMoi {
    @NotBlank
    public String ten;
    public String tacGia;
    @Min(0)
    public int soLuong;
}
