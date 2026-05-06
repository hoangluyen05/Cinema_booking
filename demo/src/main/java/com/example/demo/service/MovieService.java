package com.example.demo.service;

import com.example.demo.entity.Movie;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ShowtimeRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public MovieService(MovieRepository movieRepository, ShowtimeRepository showtimeRepository) {
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
    }

    // 1. Lấy phim bom tấn đang chiếu
    public List<Movie> getBlockbustersNowShowing() {
        return movieRepository.findByIsBlockbusterTrueAndStatus("now_showing");
    }

    // 2. Lấy phim bom tấn sắp chiếu
    public List<Movie> getBlockbustersComingSoon() {
        return movieRepository.findByIsBlockbusterTrueAndStatus("coming_soon");
    } 

    // phim đang chiếu
    public List<Movie> getNowShowing(){
        return movieRepository.findByStatus("now_showing");
    }

    // phim sắp chiếu
    public List<Movie> getComingSoon(){
        return movieRepository.findByStatus("coming_soon");
    }
    public Movie getMovieDetail(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }
    public List<Movie> getMoviesByCinema(Long cinemaId) {
    return movieRepository.findMoviesByCinemaId(cinemaId);
}
    public List<Movie> searchMovies(String keyword) {
    return movieRepository.searchMovies(keyword);
}
    // 🔥 GET + SEARCH
    public List<Movie> getAll(String title, String genre, String status) {
        return movieRepository
            .findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCaseAndStatusContainingIgnoreCase(
                title == null ? "" : title,
                genre == null ? "" : genre,
                status == null ? "" : status
            );
    }

    // 🔥 CREATE
    public Movie create(Movie movie) {
        if (movie.getBudget() == null) movie.setBudget(0.0);
        return movieRepository.save(movie);
    }

    // 🔥 UPDATE
    public Movie update(Long id, Movie movie) {
        
        Movie m = movieRepository.findById(id).orElseThrow();

        m.setTitle(movie.getTitle());
        m.setGenre(movie.getGenre());
        m.setDuration(movie.getDuration());
        m.setDescription(movie.getDescription());
        m.setReleaseDate(movie.getReleaseDate());
        m.setPoster(movie.getPoster());
        m.setStatus(movie.getStatus());

        // Cập nhật giá trị mới cho bom tấn[cite: 1]
        m.setBudget(movie.getBudget());
        m.setBlockbuster(movie.isBlockbuster());
        return movieRepository.save(m);
    }

    // 🔥 DELETE
    public void delete(Long id) {
        movieRepository.deleteById(id);
    }
}