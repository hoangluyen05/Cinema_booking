package com.example.demo.repository;

import com.example.demo.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByStatus(String status);
    // 🔍 Search theo tên phim
@Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
List<Movie> searchMovies(@Param("keyword") String keyword);


// 🎬 Lấy phim theo rạp
@Query("""
SELECT DISTINCT m 
FROM Movie m
JOIN Showtime s ON m.id = s.movieId
JOIN Room r ON s.roomId = r.id
WHERE r.cinemaId = :cinemaId
""")
    List<Movie> findMoviesByCinemaId(@Param("cinemaId") Long cinemaId);
    List<Movie> findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCaseAndStatusContainingIgnoreCase(
        String title,
        String genre,
        String status
    );
}