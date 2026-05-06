package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cinemas")
public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cinema_id")
    private Long id;

    private String cinemaName;

    private String address;

    public Cinema(){}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}