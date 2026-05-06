package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.dto.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;


    /* ================= CREATE ================= */
    public void createStaff(CreateStaffRequest req) {

        if (userRepository.existsByEmail(req.email)) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // tạo user
        User user = new User();
        user.setFullName(req.fullName);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password)); // ⚠️ sau nên encode
        user.setRole("staff");

        userRepository.save(user);

        // tạo employee
        Employee emp = new Employee();
        emp.setUser(user);
        emp.setPosition(req.position);
        emp.setStatus("active");

        employeeRepository.save(emp);
    }

    /* ================= GET ALL ================= */
   // public List<StaffResponse> getAllStaff() {
   //     return employeeRepository.findAll()
   //             .stream()
   //             .map(e -> new StaffResponse(
   //                     e.getUser().getId(),
   //                     e.getUser().getFullName(),
   //                     e.getUser().getEmail(),
    //                    e.getPosition(),
     //                   e.getStatus()
     //           ))
      //          .collect(Collectors.toList());
    //}

    /* ================= DELETE ================= */

@Transactional
public void deleteEmployee(Long employeeId){

    employeeRepository.deleteById(employeeId);

}
/* ================= SEARCH ================= */
    public List<StaffResponse> searchStaff(String name, String email) {

        if (name == null) name = "";
        if (email == null) email = "";

        List<User> users = userRepository
                .findByFullNameContainingIgnoreCaseAndEmailContainingIgnoreCaseAndRole(
                        name, email, "staff"
                );

        return users.stream().map(u -> {
            Employee e = employeeRepository.findByUser_Id(u.getId()).orElse(null);

            return new StaffResponse(
                    u.getId(),
                    u.getFullName(),
                    u.getEmail(),
                    e != null ? e.getPosition() : "",
                    e != null ? e.getStatus() : ""
            );
        }).collect(Collectors.toList());
    }
    public List<EmployeeDTO> getAllEmployees(){
    return employeeRepository.findAll().stream().map(e -> {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(e.getId());

        if (e.getUser() != null) {
            dto.setFullName(e.getUser().getFullName());
            dto.setEmail(e.getUser().getEmail());
        }

        dto.setPosition(e.getPosition());
        return dto;
    }).toList();
}
}