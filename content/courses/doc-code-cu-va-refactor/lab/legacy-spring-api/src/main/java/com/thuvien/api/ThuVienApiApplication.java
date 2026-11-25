package com.thuvien.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ThuVienApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThuVienApiApplication.class, args);
    }
}
