package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.*;
@Data
@AllArgsConstructor
public class TicketResponse {
     private Long id;
    private Long seatId;
    private Long showtimeId;
    private Long bookingId;
    private String status;

    
}
