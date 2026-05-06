package com.example.demo.dto;



public class MovieTicketStatsResponse {
    private Long movieId;
    private String movieName;
    private Long totalTickets;

    public MovieTicketStatsResponse(Long movieId, String movieName, Long totalTickets) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.totalTickets = totalTickets;
    }

    public Long getMovieId() { return movieId; }
    public String getMovieName() { return movieName; }
    public Long getTotalTickets() { return totalTickets; }
}
