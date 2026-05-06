package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long id;

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "show_date")
    private LocalDate showDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "price")
    private Double price;
     @Column(name = "end_time")
    private LocalDateTime endTime;
    public Showtime(){}

    public Long getId(){ return id; }
    public void setId(Long id){ this.id=id; }

    public Long getMovieId(){ return movieId; }
    public void setMovieId(Long movieId){ this.movieId=movieId; }

    public Long getRoomId(){ return roomId; }
    public void setRoomId(Long roomId){ this.roomId=roomId; }

    public LocalDate getShowDate(){ return showDate; }
    public void setShowDate(LocalDate showDate){ this.showDate=showDate; }

    public LocalTime getStartTime(){ return startTime; }
    public void setStartTime(LocalTime startTime){ this.startTime=startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public Double getPrice(){ return price; }
    public void setPrice(Double price){ this.price=price; }
}