package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // Thêm dòng này

@SpringBootApplication
@EnableScheduling // Kích hoạt chạy tự động theo lịch trình
public class DemoApplicationTests {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplicationTests.class, args);
    }
}