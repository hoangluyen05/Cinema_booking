package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MovieTask {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Tự động chạy vào lúc 00:00 mỗi đêm
    // "0 0 0 * * ?" tương ứng với Giây - Phút - Giờ - Ngày - Tháng - Thứ
    @Scheduled(cron = "0 0 0 * * ?")
    public void autoUpdateBlockbusterStatus() {
        try {
            jdbcTemplate.execute("CALL sp_update_blockbuster_status()");
            System.out.println("--- Đã quét doanh thu và cập nhật trạng thái bom tấn thành công ---");
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật doanh thu: " + e.getMessage());
        }
    }
}