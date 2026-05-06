package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository){
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAll(){
        return employeeRepository.findAll();
    }

    @PostMapping
    public Employee create(@RequestBody Employee employee){
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        employeeRepository.deleteById(id);
    }
}