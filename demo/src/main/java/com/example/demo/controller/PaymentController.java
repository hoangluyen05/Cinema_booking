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

import java.util.Map;

@RestController
@RequestMapping("/api/payments/payos")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create/{bookingId}")
    public ResponseEntity<?> create(
            @PathVariable Long bookingId
    ){
        return ResponseEntity.ok(
                paymentService.createPayment(bookingId)
        );
    }

    @PostMapping("/webhook")
public Map<String, Object> webhook(@RequestBody Map<String,Object> body){
    String result = paymentService.webhook(body);

    return Map.of("status", result);
}
}
