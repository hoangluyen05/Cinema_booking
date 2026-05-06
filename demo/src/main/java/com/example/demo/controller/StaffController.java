package com.example.demo.controller;

import com.example.demo.service.StaffService;
import com.example.demo.dto.*;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    /* ================= CREATE ================= */
    @PostMapping
    public String create(@RequestBody CreateStaffRequest req) {
        staffService.createStaff(req);
        return "Tạo nhân viên thành công";
    }

    /* ================= GET ALL ================= */
    @GetMapping
public List<EmployeeDTO> getAll(){
    return staffService.getAllEmployees();
}

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
public void delete(@PathVariable Long id){
    staffService.deleteEmployee(id);
}

    /* ================= SEARCH ================= */
    @GetMapping("/search")
    public List<StaffResponse> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
    ) {
        return staffService.searchStaff(name, email);
    }
}