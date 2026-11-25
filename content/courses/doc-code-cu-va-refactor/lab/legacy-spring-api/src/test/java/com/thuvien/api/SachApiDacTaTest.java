package com.thuvien.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

/** Characterization test (bài 7.2): khoá hành vi API TRƯỚC khi nâng Spring Boot — kể cả hành vi "tình cờ". */
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SachApiDacTaTest {

    @Autowired
    MockMvc mvc;

    @Test
    void danhSach_khongCanDangNhap() throws Exception {
        mvc.perform(get("/api/sach")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(3)))
           .andExpect(jsonPath("$[0].ten").value("Lập trình Java"));
    }

    @Test
    void dauGachCheoCuoi_vanKhop() throws Exception {
        mvc.perform(get("/api/sach/")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void quyDinh_docTuProperties() throws Exception {
        mvc.perform(get("/api/quy-dinh")).andExpect(status().isOk())
           .andExpect(jsonPath("$.phiTreMoiNgay").value(2000)).andExpect(jsonPath("$.soNgayMuon").value(14));
    }

    @Test
    void themSach_chuaDangNhap_401() throws Exception {
        mvc.perform(post("/api/sach").contentType(MediaType.APPLICATION_JSON).content("{\"ten\":\"Git\",\"soLuong\":1}"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void themSach_hopLe_201() throws Exception {
        mvc.perform(post("/api/sach").with(httpBasic("thuthu", "123456"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"ten\":\"Git\",\"tacGia\":\"D\",\"soLuong\":1}"))
           .andExpect(status().isCreated()).andExpect(jsonPath("$.id").value(4));
    }

    @Test
    void themSach_tenRong_400() throws Exception {
        mvc.perform(post("/api/sach").with(httpBasic("thuthu", "123456"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"ten\":\"\",\"soLuong\":1}"))
           .andExpect(status().isBadRequest());
    }

    @Test
    void xoa_thuThu_403() throws Exception {
        mvc.perform(delete("/api/admin/sach/1").with(httpBasic("thuthu", "123456"))).andExpect(status().isForbidden());
    }

    @Test
    void xoa_admin_204() throws Exception {
        mvc.perform(delete("/api/admin/sach/1").with(httpBasic("admin", "admin123"))).andExpect(status().isNoContent());
    }
}
