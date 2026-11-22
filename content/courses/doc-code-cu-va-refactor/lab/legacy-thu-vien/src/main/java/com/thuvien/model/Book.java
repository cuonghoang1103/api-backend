package com.thuvien.model;

public class Book {
    private int id;
    private String code;
    private String title;
    private String author;
    private int quantity;
    private int available;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public int getAvailable() { return available; }
    public void setAvailable(int available) { this.available = available; }
}
