package com.thuvien.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

/**
 * Lay ket noi CSDL. Viet nam 2016, "tam thoi" — chua co connection pool.
 */
public class DBUtil {

    private static Properties props = null;

    public static Connection getConnection() {
        try {
            if (props == null) {
                props = new Properties();
                InputStream in = DBUtil.class.getClassLoader().getResourceAsStream("db.properties");
                props.load(in);
            }
            String url = System.getenv("DB_URL") != null ? System.getenv("DB_URL") : props.getProperty("db.url");
            Class.forName(props.getProperty("db.driver"));
            return DriverManager.getConnection(url, props.getProperty("db.user"), props.getProperty("db.password"));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void close(AutoCloseable... list) {
        for (AutoCloseable c : list) {
            try {
                if (c != null) c.close();
            } catch (Exception e) {
            }
        }
    }
}
