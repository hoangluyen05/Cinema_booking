package com.example.demo.controller;

import com.example.demo.dto.CreateShowtimeRequest;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.ShowtimeRepository;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.ShowtimeService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin("*")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeService showtimeService;
   
    public ShowtimeController(ShowtimeRepository showtimeRepository, ShowtimeService showtimeService, MovieController movieController){
        this.showtimeRepository = showtimeRepository;
        this.showtimeService = showtimeService;
       
    }

    @GetMapping
    public List<Showtime> getAll(){
        return showtimeRepository.findAll();
    }
    @GetMapping("/movie/{movieId}")
    public List<Showtime> getShowtimeByMovie(@PathVariable Long movieId){
        return showtimeService.getShowtimeByMovie(movieId);
    }
    
    @PostMapping
public ResponseEntity<?> create(@RequestBody CreateShowtimeRequest req) {
    try {
        return ResponseEntity.ok(showtimeService.createShowtime(req));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
    @GetMapping("/date/{date}")
    public List<Showtime> getByDate(@PathVariable String date){
        return showtimeRepository.findByShowDate(LocalDate.parse(date));
}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        showtimeRepository.deleteById(id);
    }
    @GetMapping ("/search")
    public List<Showtime> getShowtimes(
        @RequestParam Long movieId,
        @RequestParam Long cinemaId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
) {
    return showtimeService.getShowtimes(movieId, cinemaId, date);
}
   @PutMapping("/{id}")
public ResponseEntity<?> update(
        @PathVariable Long id,
        @RequestBody CreateShowtimeRequest req) {
    try {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, req));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}