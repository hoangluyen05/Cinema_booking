
package com.example.demo.controller;

import com.example.demo.dto.MovieTicketStatsResponse;
import com.example.demo.service.TicketService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final TicketService ticketService;

    // ✅ Constructor (không có annotation)
    public StatisticsController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ✅ API method
    @GetMapping("/tickets-by-movie")
    public ResponseEntity<List<MovieTicketStatsResponse>> getTicketsByMovie() {
        return ResponseEntity.ok(ticketService.getTicketStatsByMovie());
    }
}

