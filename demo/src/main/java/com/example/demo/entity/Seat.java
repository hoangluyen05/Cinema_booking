package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name="seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "seat_row")
    private String seatRow;

    @Column(name = "seat_number")
    private int seatNumber;

    public Seat(){}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId(){ return roomId; }
    public void setRoomId(Long roomId){ this.roomId = roomId; }

    public String getSeatRow(){ return seatRow; }
    public void setSeatRow(String seatRow){ this.seatRow = seatRow; }

    public int getSeatNumber(){ return seatNumber; }
    public void setSeatNumber(int seatNumber){ this.seatNumber = seatNumber; }
}