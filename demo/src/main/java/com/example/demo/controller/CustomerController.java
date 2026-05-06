package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.TicketService;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserService userService;
    private final TicketService ticketService;
    public CustomerController(UserService userService, TicketService ticketService){
        this.userService = userService;
        this.ticketService = ticketService;
    }

    // API 1: Lấy danh sách khách hàng, có filter name/email
    @GetMapping
    public List<User> getCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
    ){
        return userService.getCustomers(name, email);
    }

    // API 2: Lấy chi tiết 1 khách hàng theo id (có thể dùng để hiển thị lịch sử booking)
    @GetMapping("/{id}")
    public User getCustomerById(@PathVariable Long id){
        return userService.getCustomerById(id);
    }
    // Lấy lịch sử khách hàng
    @GetMapping("/{id}/bookings")
    public List<TicketDTO> getBookingHistory(@PathVariable Long id){
        return ticketService.getTicketsByUserId(id);
    }
    
}