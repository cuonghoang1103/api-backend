package com.thuvien.testutil;

import com.thuvien.util.DBUtil;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Scanner;

/** Nạp lại dữ liệu cố định trước MỖI test (CSDL lab thật, qua DBUtil — cùng đường với code cũ). */
public final class DuLieuTest {

    public static void napLai() throws Exception {
        InputStream in = DuLieuTest.class.getResourceAsStream("/du-lieu-test.sql");
        String all = new Scanner(in, "UTF-8").useDelimiter("\\A").next();
        try (Connection con = DBUtil.getConnection(); Statement st = con.createStatement()) {
            for (String cau : all.split(";\\s*\n")) {
                String sql = cau.replaceAll("(?m)^--.*$", "").trim();
                if (!sql.isEmpty()) st.executeUpdate(sql);
            }
        }
    }

    /** Một giá trị số duy nhất từ câu SELECT. */
    public static int so(String sql) throws Exception {
        try (Connection con = DBUtil.getConnection(); Statement st = con.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            rs.next();
            return rs.getInt(1);
        }
    }

    /** Chạy một câu cập nhật để dựng tình huống riêng của một test. */
    public static void chay(String sql) throws Exception {
        try (Connection con = DBUtil.getConnection(); Statement st = con.createStatement()) {
            st.executeUpdate(sql);
        }
    }

    private DuLieuTest() { }
}
