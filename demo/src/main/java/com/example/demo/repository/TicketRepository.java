package com.example.demo.repository;

import com.example.demo.dto.MovieTicketStatsResponse;
import com.example.demo.dto.TicketDTO;
import com.example.demo.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    List<Ticket> findByShowtimeId(Long showtimeId);
    List<Ticket> findByBookingId(Long bookingId);
    boolean existsBySeat_IdAndShowtimeId(Long seatId, Long showtimeId);
    @Query("""
SELECT t FROM Ticket t
WHERE t.showtimeId = :showtimeId
AND t.seat.id IN :seatIds
""")
List<Ticket> findBookedSeats(Long showtimeId, List<Long> seatIds);
   
@Query("""
SELECT new com.example.demo.dto.MovieTicketStatsResponse(
    m.id,
    m.title,
    COUNT(t.id)
)
FROM Ticket t
JOIN Showtime s ON s.id = t.showtimeId
JOIN Movie m ON m.id = s.movieId
WHERE t.status = 'booked'
GROUP BY m.id, m.title
""")
List<MovieTicketStatsResponse> countTicketsByMovie();
@Query("SELECT t FROM Ticket t JOIN Booking b ON t.bookingId = b.id WHERE b.userId = :userId")
    List<Ticket> findByBookingUserId(@Param("userId") Long userId);

    // Trả TicketDTO trực tiếp (title, quantity, showDate)
    @Query("""
        SELECT new com.example.demo.dto.TicketDTO(
            m.title,
            1,
            s.showDate
        )
        FROM Ticket t
        JOIN Booking b ON t.bookingId = b.id
        JOIN Showtime s ON t.showtimeId = s.id
        JOIN Movie m ON s.movieId = m.id
        WHERE b.userId = :userId
    """)
    List<TicketDTO> findTicketDTOByUserId(@Param("userId") Long userId);
    boolean existsByCode(String code);
    List<Ticket> findByShowtimeIdAndStatus(Long showtimeId, String status);
     
    Optional<Ticket> findBySeat_IdAndShowtimeId(Long seatId, Long showtimeId);

boolean existsBySeat_IdAndShowtimeIdAndStatusIn(
    Long seatId,
    Long showtimeId,
    List<String> statuses
);

     @Query("""
        SELECT u FROM User u
        WHERE u.id = (
            SELECT b.userId FROM Booking b
            WHERE b.id = (
                SELECT t.bookingId FROM Ticket t WHERE t.id = :ticketId
            )
        )
    """)
    User findUserByTicketId(@Param("ticketId") Long ticketId);
   
}