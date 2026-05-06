package com.example.demo.service;

import com.example.demo.dto.MovieTicketStatsResponse;
import com.example.demo.dto.TicketDTO;
import com.example.demo.dto.TicketResponse;
import com.example.demo.entity.Movie;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.Ticket;
import com.example.demo.entity.User;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;

    public TicketService(TicketRepository ticketRepository,
                         ShowtimeRepository showtimeRepository,
                         MovieRepository movieRepository) {
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

   public List<TicketDTO> getTicketsByUserId(Long userId){
    // Cách đơn giản: dùng query trả DTO trực tiếp
    return ticketRepository.findTicketDTOByUserId(userId);
}
    

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    public List<Ticket> getByBooking(Long bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
    public String checkin(Long id){
    return "OK";
}
    boolean existsBySeat_IdAndShowtimeId(Long seatId, Long showtimeId){
        return ticketRepository.existsBySeat_IdAndShowtimeId(seatId, showtimeId);
    }

    public List<Ticket> findByBookingId(Long bookingId){
        return ticketRepository.findByBookingId(bookingId);
    }
    public List<TicketResponse> getTicketsByUser(String username) {
        List<Ticket> tickets = ticketRepository.findAll();

         return tickets.stream().map(t -> new TicketResponse(
            t.getId(),
            t.getSeatId(),
            t.getShowtimeId(),
            t.getBookingId(),
            t.getStatus()
    )).toList();
    }

    // ✅ HỦY VÉ
    public void cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        

        ticketRepository.delete(ticket);
    }
    public List<MovieTicketStatsResponse> getTicketStatsByMovie() {
    return ticketRepository.countTicketsByMovie();
}

    public List<Ticket> getAllUsers() {
        return ticketRepository.findAll();
    }
    
}