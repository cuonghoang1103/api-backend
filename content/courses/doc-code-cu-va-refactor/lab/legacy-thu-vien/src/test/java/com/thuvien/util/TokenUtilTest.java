package com.thuvien.util;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TokenUtilTest {

    @Test
    public void tokenCoDinh() {
        assertEquals(32, TokenUtil.makeToken("admin").length());
    }
}
