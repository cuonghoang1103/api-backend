package com.thuvien.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TokenUtilDacTaTest {

    @Test
    void tokenCuaAdmin() {
        // Đặc tả hành vi HIỆN TẠI (MD5 của username + "thuvien2016") — không phải hành vi đúng
        assertEquals("a316eabce65f3759e1ce2d96db99486c", TokenUtil.makeToken("admin"));
    }
}
