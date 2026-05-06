package com.example.demo.controller;

import com.example.demo.dto.SeatResponse;
import com.example.demo.entity.Seat;
import com.example.demo.repository.SeatRepository;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin("*")
public class SeatController {

    private final SeatRepository seatRepository;
    private final SeatService seatService;

    public SeatController(SeatRepository seatRepository, SeatService seatService) {
        this.seatRepository = seatRepository;
        this.seatService = seatService;
    }

    

    @GetMapping
    public List<Seat> getAll(){
        return seatRepository.findAll();
    }
     @GetMapping("/room/{room_id}")
    public List<Seat> getSeatsByRoom(@PathVariable Long room_id){
        return seatRepository.findByRoomId(room_id);
    }

    @PostMapping
    public Seat create(@RequestBody Seat seat){
        return seatRepository.save(seat);
    }
    @GetMapping("/showtime/{showtimeId}")
    public List<SeatResponse> getSeats(@PathVariable Long showtimeId) {
        return seatService.getSeatsByShowtime(showtimeId);
    }
}