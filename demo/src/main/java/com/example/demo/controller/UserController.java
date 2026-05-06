package com.example.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserRepository usersRepository;
    private final UserService userService;

    public UserController(UserRepository usersRepository, UserService userService) {
        this.usersRepository = usersRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll(){
        return usersRepository.findAll();
    }

    @PostMapping
    public User create(@RequestBody User user){
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        usersRepository.deleteById(id);
    }
    // 🔹 Lấy thông tin user
    @GetMapping("/me")
public ResponseEntity<?> getMe(@RequestParam String email) {
    try {
        User user = userService.getByUsername(email);
        return ResponseEntity.ok(user);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}
    // 🔹 Update profile
    @PutMapping("/me")
public ResponseEntity<?> update(
        @RequestParam String email,
        @RequestBody UpdateUserRequest req) {

    try {
        return ResponseEntity.ok(userService.updateProfile(email, req));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}

   @PutMapping("/change-password")
public ResponseEntity<?> changePass(
        @RequestParam String email,
        @RequestBody ChangePasswordRequest req) {

    try {
        userService.changePassword(email, req);
        return ResponseEntity.ok("OK");
    } catch (Exception e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}
}