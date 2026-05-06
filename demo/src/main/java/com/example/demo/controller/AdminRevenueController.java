package com.example.demo.controller;
import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.*;
import com.example.demo.service.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController
@RequestMapping("/api/admin")
public class AdminRevenueController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/revenue")
    public Map<String, Object> getRevenue() {

        List<Booking> paid =
                bookingRepository.findByStatus("paid");

        double total =
                paid.stream()
                        .mapToDouble(Booking::getTotal_price)
                        .sum();

        int totalTickets =
                paid.size();

        return Map.of(
                "totalRevenue", total,
                "totalBookings", paid.size(),
                "totalTickets", totalTickets
        );
    }
    @GetMapping("/revenue/cinema")
public List<?> byCinema(@RequestParam int year){
    return bookingRepository.revenueByCinema(year);
}

   
    @GetMapping("/revenue/year")
    public List<?> byYear(){
        return bookingRepository.revenueByYear();
    }

    @GetMapping("/revenue/month/cinema")
public List<Object[]> getRevenueByMonthCinema(
        @RequestParam Long cinemaId,
        @RequestParam int year) {
    return bookingRepository.getRevenueByMonthCinema(cinemaId, year);
}

        @GetMapping("/revenue/year/cinema")
public List<Object[]> getRevenueByYearCinema(
        @RequestParam Long cinemaId) {
    return bookingRepository.getRevenueByYearCinema(cinemaId);
}

@GetMapping("/revenue/movie")
public List<Object[]> getRevenueByMovie(@RequestParam int year) {
    return bookingRepository.getRevenueByMovie(year);
}

@GetMapping("/revenue/month")
public List<Object[]> byMonth(@RequestParam int year){
    return bookingRepository.revenueByMonth(year);
}
}
