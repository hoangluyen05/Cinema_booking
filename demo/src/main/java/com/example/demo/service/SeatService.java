package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;

    public SeatService(SeatRepository seatRepository,
                       TicketRepository ticketRepository,
                       ShowtimeRepository showtimeRepository) {
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
    }
    public List<SeatResponse> getSeatsByShowtime(Long showtimeId) {

    // 1. Lấy showtime
    Showtime showtime = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));

    // 2. Lấy roomId (SỬA CHỖ NÀY)
    Long roomId = showtime.getRoomId();

    // 3. Lấy ghế
    List<Seat> seats = seatRepository.findByRoomId(roomId);

    // 4. Lấy vé đã đặt
    List<Ticket> tickets = ticketRepository
        .findByShowtimeIdAndStatus(showtimeId, "booked");

    Set<Long> bookedSeatIds = tickets.stream()
            .map(t -> t.getSeatId()) // ⚠️ vì bạn dùng id chứ không phải object
            .collect(Collectors.toSet());

    // 5. Map dữ liệu
    return seats.stream().map(seat -> {
        SeatResponse res = new SeatResponse();
        res.setSeatId(seat.getId());
        res.setSeatRow(seat.getSeatRow());
        res.setSeatNumber(seat.getSeatNumber());

        res.setStatus(
                bookedSeatIds.contains(seat.getId())
                        ? "booked"
                        : "available"
        );

        return res;
    }).toList();
}
}