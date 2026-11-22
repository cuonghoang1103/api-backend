package com.thuvien.model;

import java.util.Date;

public class Loan {
    public int id;
    public int bookId;
    public int readerId;
    public String bookTitle;
    public String readerName;
    public Date borrowDate;
    public Date dueDate;
    public Date returnDate;
    public double fine;
}
