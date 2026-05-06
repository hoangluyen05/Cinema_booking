package com.example.demo.repository;

import com.example.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ================= BASIC =================
    List<Booking> findByUserId(Long userId);

    Optional<Booking> findByCode(String code);

    List<Booking> findByStatus(String status);

    // ================= 1. DOANH THU THEO RẠP =================
  @Query(value = """
SELECT 
    c.cinema_name,
    COALESCE(SUM(b.total_price), 0) AS revenue
FROM cinemas c
LEFT JOIN room r ON c.cinema_id = r.cinema_id
LEFT JOIN showtimes s ON r.room_id = s.room_id
LEFT JOIN bookings b 
    ON b.showtime_id = s.showtime_id 
    AND b.status = 'paid'
    AND YEAR(b.created_at) = :year
GROUP BY c.cinema_id, c.cinema_name
ORDER BY revenue DESC
""", nativeQuery = true)
List<Object[]> revenueByCinema(@Param("year") int year);

    // ================= 2. DOANH THU THEO THÁNG =================
   

    // ================= 3. DOANH THU THEO NĂM =================
    @Query("""
        SELECT YEAR(b.createdAt), SUM(b.total_price)
        FROM Booking b
        WHERE b.status = 'paid'
        GROUP BY YEAR(b.createdAt)
        ORDER BY YEAR(b.createdAt)
    """)
    List<Object[]> revenueByYear();

    // ================= 4. DOANH THU THEO THÁNG THEO RẠP =================
    @Query(value = """
        SELECT 
            MONTH(b.created_at) AS month,
            COALESCE(SUM(b.total_price), 0) AS revenue
        FROM bookings b
        LEFT JOIN showtimes s ON b.showtime_id = s.showtime_id
        LEFT JOIN room r ON s.room_id = r.room_id
        WHERE r.cinema_id = :cinemaId
          AND YEAR(b.created_at) = :year
          AND b.status = 'paid'
        GROUP BY YEAR(b.created_at), MONTH(b.created_at)
        ORDER BY MONTH(b.created_at)
    """, nativeQuery = true)
    List<Object[]> getRevenueByMonthCinema(
            @Param("cinemaId") Long cinemaId,
            @Param("year") int year
    );

    // ================= 5. DOANH THU THEO NĂM THEO RẠP =================
    @Query(value = """
        SELECT 
            YEAR(b.created_at) AS year,
            COALESCE(SUM(b.total_price), 0) AS revenue
        FROM bookings b
        LEFT JOIN showtimes s ON b.showtime_id = s.showtime_id
        LEFT JOIN room r ON s.room_id = r.room_id
        WHERE r.cinema_id = :cinemaId
          AND b.status = 'paid'
        GROUP BY YEAR(b.created_at)
        ORDER BY YEAR(b.created_at)
    """, nativeQuery = true)
    List<Object[]> getRevenueByYearCinema(@Param("cinemaId") Long cinemaId);

    // ================= 6. DOANH THU THEO PHIM =================
    @Query(value = """
    SELECT 
        m.title,
        COALESCE(SUM(b.total_price), 0) AS revenue
    FROM movies m
    LEFT JOIN showtimes s ON s.movie_id = m.movie_id
    LEFT JOIN bookings b 
        ON b.showtime_id = s.showtime_id 
        AND b.status = 'paid'
        AND YEAR(b.created_at) = :year
    GROUP BY m.movie_id, m.title
    ORDER BY revenue DESC
""", nativeQuery = true)
List<Object[]> getRevenueByMovie(@Param("year") int year);

   @Query("""
    SELECT MONTH(b.createdAt), SUM(b.total_price)
    FROM Booking b
    WHERE b.status = 'paid'
      AND YEAR(b.createdAt) = :year
    GROUP BY MONTH(b.createdAt)
    ORDER BY MONTH(b.createdAt)
""")
List<Object[]> revenueByMonth(@Param("year") int year);
}

// .\gradlew bootRun