package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name="bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="booking_id")
    private Long id;
    @Column(name="user_id")
    private Long userId;

    //@Column(name="seat_id")
    //private Long seatId;

    @Column(name="showtime_id")
    private Long showtimeId;

    private Double total_price;
    @Column(name = "status")
    private String status;
    private String code;
    @Column(name="created_at")
    private LocalDateTime createdAt;
   @OneToMany
@JoinColumn(name = "booking_id") // 👈 map thủ công
private List<Ticket> tickets;

@PrePersist
public void prePersist(){
    createdAt = LocalDateTime.now();
}
public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

    public Booking(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public Long getUserId(){return userId;}
    public void setUserId(Long userId){this.userId=userId;}

    public Long getShowtimeId(){return showtimeId;}
    public void setShowtimeId(Long showtimeId){this.showtimeId=showtimeId;}

    public Double getTotal_price(){return total_price;}
    public void setTotal_price(Double total_price){this.total_price=total_price;}

   // public Long getSeatId() { return seatId; }
    //public void setSeatId(Long seatId) { this.seatId = seatId; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
      public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}