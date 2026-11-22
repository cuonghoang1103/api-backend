package com.thuvien.model;

public class Reader {
    private int id;
    private String name;
    private String type;   // "SV", "GV", "KHACH"
    private String phone;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
