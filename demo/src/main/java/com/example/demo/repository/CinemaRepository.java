package com.example.demo.repository;

import com.example.demo.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
   @Query("""
    SELECT DISTINCT c FROM Cinema c
    JOIN Room r ON r.cinemaId = c.id
    JOIN Showtime s ON s.roomId = r.id
    WHERE s.movieId = :movieId
""")
    List<Cinema> findCinemasByMovie(@Param("movieId") Long movieId);
    List<Cinema> findByCinemaNameContainingIgnoreCaseAndAddressContainingIgnoreCase(
    String cinemaName,
    String address
);
}