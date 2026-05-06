package com.example.demo.repository;

import com.example.demo.entity.Employee;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUser_Id(Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Employee e WHERE e.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM employees WHERE employees_id = :id", nativeQuery = true)
    void deleteByEmployeeId(@Param("id") Long id);
}