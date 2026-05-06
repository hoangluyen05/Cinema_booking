package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {

    private Long id;
    private String code;
    private String showtime;
    private Double totalPrice;
    private LocalDateTime createdAt;
    private String status;
    private List<String> seats;

    // 🔥 constructor full
    public BookingResponse(Long id,
                           String code,
                           String showtime,
                           Double totalPrice,
                           LocalDateTime createdAt,
                           String status,
                           List<String> seats) {
        this.id = id;
        this.code = code;
        this.showtime = showtime;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.status = status;
        this.seats = seats;
    }

    // getter setter
    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getShowtime() { return showtime; }
    public Double getTotalPrice() { return totalPrice; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getStatus() { return status; }
    public List<String> getSeats() { return seats; }

    public void setId(Long id) { this.id = id; }
    public void setCode(String code) { this.code = code; }
    public void setShowtime(String showtime) { this.showtime = showtime; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setStatus(String status) { this.status = status; }
    public void setSeats(List<String> seats) { this.seats = seats; }
}