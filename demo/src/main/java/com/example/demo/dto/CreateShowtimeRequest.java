package com.example.demo.dto;


import java.time.*;
import com.fasterxml.jackson.annotation.JsonFormat;

public class CreateShowtimeRequest {

    private Long movieId;
    private Long roomId;
    private Double price;
    // 🔹 Annotation để Jackson parse đúng từ JSON sang LocalDateTime
    @JsonFormat(pattern = "HH:mm:ss")  
    private LocalTime startTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate showDate;

    // =========================
    // Getters & Setters
    // =========================

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }
}