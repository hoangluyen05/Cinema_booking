package com.example.demo.repository;

import com.example.demo.entity.Seat;
import com.example.demo.entity.Ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByRoomId(Long roomId);
    
}