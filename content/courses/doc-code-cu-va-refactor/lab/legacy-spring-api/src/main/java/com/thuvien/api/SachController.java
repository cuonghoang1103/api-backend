package com.thuvien.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SachController {
    private final SachRepository kho;
    private final ThuVienProperties cauHinh;

    public SachController(SachRepository kho, ThuVienProperties cauHinh) {
        this.kho = kho;
        this.cauHinh = cauHinh;
    }

    @GetMapping("/api/sach")
    public List<Sach> danhSach() {
        return kho.findAll();
    }

    @GetMapping("/api/sach/{id}")
    public ResponseEntity<Sach> mot(@PathVariable Long id) {
        return kho.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/sach")
    @ResponseStatus(HttpStatus.CREATED)
    public Sach them(@Valid @RequestBody SachMoi moi) {
        return kho.save(new Sach(moi.ten, moi.tacGia, moi.soLuong));
    }

    @GetMapping("/api/quy-dinh")
    public Map<String, Object> quyDinh() {
        Map<String, Object> m = new HashMap<>();
        m.put("phiTreMoiNgay", cauHinh.getPhiTreMoiNgay());
        m.put("soNgayMuon", cauHinh.getSoNgayMuon());
        return m;
    }

    @DeleteMapping("/api/admin/sach/{id}")
    public ResponseEntity<Void> xoa(@PathVariable Long id) {
        kho.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
