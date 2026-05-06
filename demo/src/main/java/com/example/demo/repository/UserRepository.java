package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByFullNameContainingIgnoreCaseAndEmailContainingIgnoreCaseAndRole(
            String fullName, String email, String role
    );
    @Query("SELECT u FROM User u " +
           "WHERE (:name IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    List<User> findByNameAndEmail(@Param("name") String name,
                                  @Param("email") String email);

     List<User> findByRole(String role);

    List<User> findByRoleAndFullNameContainingIgnoreCase(String role, String fullName);

    List<User> findByRoleAndEmailContainingIgnoreCase(String role, String email);

    List<User> findByRoleAndFullNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
        String role, String fullName, String email
    );
}