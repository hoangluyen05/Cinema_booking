package com.example.demo.controller;

import com.example.demo.entity.Cinema;
import com.example.demo.repository.CinemaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.*;
import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin("*")
public class CinemaController {
    @Autowired
    private CinemaService cinemaService;
    private final CinemaRepository cinemaRepository;

    public CinemaController(CinemaRepository cinemaRepository) {
        this.cinemaRepository = cinemaRepository;
    }

    

    @PostMapping
    public Cinema create(@RequestBody Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    // PUT
    @PutMapping("/{id}")
    public Cinema update(@PathVariable Long id, @RequestBody Cinema cinema) {
        return cinemaService.update(id, cinema);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cinemaRepository.deleteById(id);
    }
    @GetMapping("/by-movie")
    public List<Cinema> getByMovie(@RequestParam Long movieId) {
        return cinemaService.getCinemasByMovie(movieId);
    }
    // GET list + filter
    @GetMapping
public List<Cinema> getAll(
    @RequestParam(required = false) String cinemaName,
    @RequestParam(required = false) String address
) {
    return cinemaService.getAll(cinemaName, address);
}
}