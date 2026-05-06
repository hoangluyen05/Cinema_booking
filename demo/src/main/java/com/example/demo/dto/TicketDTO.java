package com.example.demo.dto;

import java.time.LocalDate;

public class TicketDTO {
    private String movie;
    private int quantity;
    private LocalDate date;

    public TicketDTO(String movie, int quantity, LocalDate date){
        this.movie = movie;
        this.quantity = quantity;
        this.date = date;
    }

    public String getMovie() { return movie; }
    public void setMovie(String movie) { this.movie = movie; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}