package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.*;
import com.example.demo.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;
    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;

    public BookingController(BookingService bookingService, TicketRepository ticketRepository, BookingRepository bookingRepository){
        this.bookingService = bookingService;
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
    }

    // ✅ lấy danh sách booking
    @GetMapping
    public ResponseEntity<List<Booking>> getAll(){
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ API đặt vé
    @PostMapping
    public ResponseEntity<?> create(@RequestBody BookingRequest request){
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // 👤 3. Lịch sử đặt vé theo user
    @GetMapping("/user/{id}")
public ResponseEntity<List<BookingResponse>> getByUser(@PathVariable Long id) {
    return ResponseEntity.ok(bookingService.getByUser(id));
}

    // ❌ 4. Hủy vé
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancel(@PathVariable Long bookingId){
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @GetMapping("/code/{code}")
public ResponseEntity<?> getBookingByCode(@PathVariable String code){

    Booking booking = bookingRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

    List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());

    Map<String, Object> result = new HashMap<>();
    result.put("booking", booking);
    result.put("tickets", tickets);

    return ResponseEntity.ok(result);
}

    @PutMapping("/checkin/{code}")
public ResponseEntity<?> checkInBooking(@PathVariable String code){

    Booking booking = bookingRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

    List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());

    for (Ticket t : tickets){

        if ("used".equals(t.getStatus())) {
            throw new RuntimeException("Có vé đã được check-in trước đó");
        }

        if ("cancelled".equals(t.getStatus())) {
            continue; // bỏ qua vé đã hủy
        }

        t.setStatus("used");
    }

    ticketRepository.saveAll(tickets);

    // update booking luôn (optional)
    booking.setStatus("used");
    bookingRepository.save(booking);

    return ResponseEntity.ok("Check-in thành công toàn bộ vé");
}
}