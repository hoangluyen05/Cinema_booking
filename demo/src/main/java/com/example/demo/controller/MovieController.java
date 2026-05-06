package com.example.demo.controller;

import com.example.demo.entity.Movie;
import com.example.demo.entity.Showtime;
import com.example.demo.service.MovieService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin("*")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }

    // API lấy phim bom tấn đang chiếu
    @GetMapping("/blockbusters/now-showing")
    public List<Movie> getNowShowingBlockbusters() {
        return movieService.getBlockbustersNowShowing();
    }

    // API lấy phim bom tấn sắp chiếu
    @GetMapping("/blockbusters/coming-soon")
    public List<Movie> getComingSoonBlockbusters() {
        return movieService.getBlockbustersComingSoon();
    }
    // phim đang chiếu
    @GetMapping("/now-showing")
    public List<Movie> getNowShowing(){
        return movieService.getNowShowing();
    }

    // phim sắp chiếu
    @GetMapping("/coming-soon")
    public List<Movie> getComingSoon(){
        return movieService.getComingSoon();
    }
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getMovieDetail(@PathVariable Long id) {
        Movie movie = movieService.getMovieDetail(id);
        List<Showtime> showtimes = movieService.getShowtimesByMovie(id);
        Map<String, Object> result = new HashMap<>();
        result.put("movie", movie);
        result.put("showtimes", showtimes);
        return ResponseEntity.ok(result);
    }
    // 4️⃣ Lấy danh sách showtime theo phim
    @GetMapping("/{id}/showtimes")
    public List<Showtime> getShowtimesByMovie(@PathVariable Long id) {
        return movieService.getShowtimesByMovie(id);
    }

    @GetMapping("/cinema/{cinemaId}")
    public List<Movie> getMoviesByCinema(@PathVariable Long cinemaId) {
        return movieService.getMoviesByCinema(cinemaId);
}
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String keyword) {
    return movieService.searchMovies(keyword);
}
    // 🔥 GET + SEARCH
    @GetMapping
    public List<Movie> getAll(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String genre,
        @RequestParam(required = false) String status
    ) {
        return movieService.getAll(title, genre, status);
    }

    // 🔥 POST
    @PostMapping
    public Movie create(@RequestBody Movie movie) {
        return movieService.create(movie);
    }

    // 🔥 PUT
    @PutMapping("/{id}")
    public Movie update(@PathVariable Long id, @RequestBody Movie movie) {
        return movieService.update(id, movie);
    }

    // 🔥 DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        movieService.delete(id);
    }
}