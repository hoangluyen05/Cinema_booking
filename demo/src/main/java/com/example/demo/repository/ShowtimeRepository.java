package com.example.demo.repository;

import com.example.demo.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    List<Showtime> findByMovieId(Long movieId);
    List<Showtime> findByShowDate(LocalDate showDate);
    @Query("""
    SELECT s FROM Showtime s
    JOIN Room r ON s.roomId = r.id
    WHERE s.movieId = :movieId
      AND r.cinemaId = :cinemaId
      AND s.showDate = :date
""")
List<Showtime> findShowtimes(
    @Param("movieId") Long movieId,
    @Param("cinemaId") Long cinemaId,
    @Param("date") LocalDate date
);

    // Lấy theo rạp
    List<Showtime> findByRoomId(Long roomId);
    @Query("""
SELECT s FROM Showtime s
WHERE s.roomId = :roomId
AND (
    :startTime < s.endTime
    AND :endTime > s.startTime
)
""")
List<Showtime> checkConflict(
    Long roomId,
    LocalDateTime startTime,
    LocalDateTime endTime
);

}