package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterDTO;
import com.example.demo.entity.User;
import com.example.demo.service.AuthService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:5173"
    },
    allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterDTO dto){
        return authService.register(dto);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request,
            HttpSession session
    ){
        return authService.login(request, session);
    }

    // ================= GET USER =================
    @GetMapping("/me")
    public Object me(HttpSession session){

        User user = (User) session.getAttribute("user");

        if(user == null){
            return null;
        }

        return Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole()
        );
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public void logout(HttpSession session){
        session.invalidate();
    }
}