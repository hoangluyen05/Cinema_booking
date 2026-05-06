package com.example.demo.dto;

public class StaffResponse {
    public Long userId;
    public String fullName;
    public String email;
    public String position;
    public String status;

    public StaffResponse(Long userId, String fullName, String email, String position, String status) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.position = position;
        this.status = status;
    }
}