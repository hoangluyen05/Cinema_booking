package com.example.demo.dto;

public class RoomDTO {
    private Long id;
    private String roomName;
    private int totalseats;
    private Long cinemaId;
    private String cinemaName;

    // getter & setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public int getTotalSeats() { return totalseats; }
    public void setTotalSeats(int totalSeats) { this.totalseats = totalSeats; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }
}