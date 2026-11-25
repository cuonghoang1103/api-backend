package com.thuvien.api;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sach")
public class Sach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ten;
    private String tacGia;
    private int conLai;

    protected Sach() { }

    public Sach(String ten, String tacGia, int conLai) {
        this.ten = ten;
        this.tacGia = tacGia;
        this.conLai = conLai;
    }

    public Long getId() { return id; }
    public String getTen() { return ten; }
    public String getTacGia() { return tacGia; }
    public int getConLai() { return conLai; }
}
