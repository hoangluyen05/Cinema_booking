package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.repository.TicketRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.*;
import com.example.demo.dto.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin("*")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final TicketService ticketService;

    public TicketController(TicketRepository ticketRepository, TicketService ticketService) {
        this.ticketRepository = ticketRepository;
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<Ticket> getAll(){
        return ticketRepository.findAll();
    }

    @GetMapping("/showtime/{showtimeId}")
    public List<Ticket> getByShowtime(@PathVariable Long showtimeId){
        return ticketRepository.findByShowtimeId(showtimeId);
    }

    @GetMapping("/booking/{bookingId}")
    public List<Ticket> getByBooking(@PathVariable Long bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket){
        return ticketRepository.save(ticket);
    }
    // 🔹 Lấy vé của user
    @GetMapping("/my")
    public List<TicketResponse> getMyTickets(Authentication auth) {
        return ticketService.getTicketsByUser(auth.getName());
    }

    // 🔹 Hủy vé
    @DeleteMapping("/{id}")
public String cancelTicket(@PathVariable Long id) {
    ticketService.cancelTicket(id);
    return "Hủy vé thành công";
}

    // Lấy thông tin người đặt vé
    @GetMapping("/{id}/user")
    public User getUserByTicket(@PathVariable Long id) {
        return ticketRepository.findUserByTicketId(id);
    }
}