package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name="tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ticket_id")
    private Long id;
    @ManyToOne
    @JoinColumn(name="seat_id")
    private Seat seat;
    @Column(name="booking_id")
    private Long bookingId;

    @Column(name="showtime_id")
    private Long showtimeId;
    @Column(name = "status")
    private String status;
    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "price")
    private double price;

    public String getStatus() {
    return status;
}

    public void setStatus(String status) {
    this.status = status;
}
    public Ticket(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public Long getBookingId(){return bookingId;}
    public void setBookingId(Long bookingId){this.bookingId=bookingId;}
    public Double getPrice(){return price;}
    public void setPrice(Double price){
        this.price=price;
    }

    public Long getShowtimeId(){return showtimeId;}
    public void setShowtimeId(Long showtimeId){this.showtimeId=showtimeId;}
    public String getCode(){return code;}
    public void setCode(String code){this.code=code;}
    public Seat getSeat(){return seat;}
    public void setSeat(Seat seat){this.seat=seat;}
    public Long getSeatId() {
    return seat.getId();
}
}