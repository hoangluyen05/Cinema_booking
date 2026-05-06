package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long id;

    @Column(name = "cinema_id")
    private Long cinemaId;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "total_seats")
    private Integer totalseats;

    public Room() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Integer getTotalSeats() {
        return totalseats;
    }

    public void setTotalSeats(Integer totalseats) {
        this.totalseats = totalseats;
    }
}