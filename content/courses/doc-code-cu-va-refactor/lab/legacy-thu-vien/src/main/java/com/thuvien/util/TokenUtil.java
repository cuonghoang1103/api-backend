package com.thuvien.util;

import java.security.MessageDigest;
import javax.xml.bind.DatatypeConverter;

/**
 * Token cho cookie "ghi nho dang nhap". MD5 cua username + "thuvien2016".
 */
public class TokenUtil {

    public static String makeToken(String username) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] b = md.digest((username + "thuvien2016").getBytes("UTF-8"));
            return DatatypeConverter.printHexBinary(b).toLowerCase();
        } catch (Exception e) {
            return "";
        }
    }
}
