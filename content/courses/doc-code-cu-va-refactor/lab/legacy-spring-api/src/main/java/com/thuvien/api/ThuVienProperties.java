package com.thuvien.api;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

/** thuvien.phi-tre-moi-ngay, thuvien.so-ngay-muon trong application.properties. */
@ConstructorBinding
@ConfigurationProperties("thuvien")
public class ThuVienProperties {
    private final long phiTreMoiNgay;
    private final int soNgayMuon;

    public ThuVienProperties(long phiTreMoiNgay, int soNgayMuon) {
        this.phiTreMoiNgay = phiTreMoiNgay;
        this.soNgayMuon = soNgayMuon;
    }

    public long getPhiTreMoiNgay() { return phiTreMoiNgay; }
    public int getSoNgayMuon() { return soNgayMuon; }
}
