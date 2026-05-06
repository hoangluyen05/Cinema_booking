package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.dto.BookingResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;

    public BookingService(BookingRepository bookingRepository,
                          TicketRepository ticketRepository,
                          SeatRepository seatRepository,
                        ShowtimeRepository showtimeRepository) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.seatRepository = seatRepository;
        this.showtimeRepository =showtimeRepository;
    }
    private String generateTicketCode(Showtime showtime, Seat seat) {
    int random = new Random().nextInt(90) + 10;

    return "T-"+showtime.getMovieId() + 
           showtime.getRoomId() + 
           showtime.getId() + 
           seat.getSeatRow() + seat.getSeatNumber() + 
           random;
}

    private String generateBookingCode(Showtime showtime) {
        int r = new Random().nextInt(9000) + 1000;
    return "B-" +
            showtime.getMovieId() + 
            showtime.getRoomId() + 
            showtime.getId() + 
            r;
}

    // ✅ API đặt vé
    @Transactional
public Booking createBooking(BookingRequest request){

    // 1. validate input
    if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
        throw new RuntimeException("Danh sách ghế không được trống");
    }

    // 2. lấy showtime
    Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
            .orElseThrow(() -> new RuntimeException("Showtime không tồn tại"));

    double total_price = 0;

    // 3. tạo booking (status đúng DB)
    Booking booking = new Booking();
    booking.setUserId(request.getUserId());
    booking.setShowtimeId(request.getShowtimeId());
    booking.setStatus("pending"); // 🔥 đúng ENUM DB
    String code = generateBookingCode(showtime);
    booking.setCode(code);
    booking = bookingRepository.save(booking);

    // 4. xử lý từng ghế
    for(Long seatId : request.getSeatIds()){

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Ghế không tồn tại: " + seatId));

        // 🔥 tìm ticket đã tồn tại (do UNIQUE)
        Ticket ticket;
        var existing = ticketRepository
                .findBySeat_IdAndShowtimeId(seatId, request.getShowtimeId());

        if (existing.isPresent()) {

            ticket = existing.get();

            // ❗ nếu đã đặt rồi → chặn
            if ("booked".equals(ticket.getStatus()) || "used".equals(ticket.getStatus())) {
                throw new RuntimeException("Ghế " + seatId + " đã được đặt");
            }

            // ❗ nếu đã cancel → dùng lại
            if ("cancelled".equals(ticket.getStatus())) {
                ticket.setStatus("pending");
            }

        } else {
            // chưa có → tạo mới
            ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setShowtimeId(request.getShowtimeId());
            ticket.setStatus("pending");
        }

        // 🔥 set chung
        ticket.setBookingId(booking.getId());
        ticket.setPrice(showtime.getPrice());

        // 🔥 tạo code (unique)
        String ticketCode;
        do {
            ticketCode = generateTicketCode(showtime, seat);
        } while (ticketRepository.existsByCode(ticketCode));

        ticket.setCode(ticketCode);

        total_price += showtime.getPrice();

        ticketRepository.save(ticket);
    }

    // 5. tổng tiền
    booking.setTotal_price(total_price);

    return bookingRepository.save(booking);
}
    // ✅ hủy vé
    @Transactional
    public String cancelBooking(Long bookingId){

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        booking.setStatus("cancelled");
        bookingRepository.save(booking);

        List<Ticket> tickets = ticketRepository.findByBookingId(bookingId);

        for (Ticket t : tickets){
            t.setStatus("cancelled");
        }

        ticketRepository.saveAll(tickets);

        return "Hủy vé thành công";
    }
    public List<Booking> getAllBookings(){
    return bookingRepository.findAll();
}
    public List<BookingResponse> getByUser(Long userId){

    List<Booking> bookings = bookingRepository.findByUserId(userId);

    return bookings.stream().map(b -> {

        // 👉 lấy showtime
        Showtime showtime = showtimeRepository
                .findById(b.getShowtimeId())
                .orElse(null);

        // 👉 lấy tickets
        List<Ticket> tickets = ticketRepository
                .findByBookingId(b.getId());

        // 👉 map ghế
        List<String> seats = tickets.stream()
                .map(t -> t.getSeat().getSeatRow() + t.getSeat().getSeatNumber())
                .toList();

        
        var dateTime = java.time.LocalDateTime.of(
    showtime.getShowDate(),
    showtime.getStartTime()
);

return new BookingResponse(
    b.getId(),
    b.getCode(),
    dateTime.toString(),   // 🔥 gộp ngày + giờ
    b.getTotal_price(),
    b.getCreatedAt(),
    b.getStatus(),
    seats
);

    }).toList();
}
    
}