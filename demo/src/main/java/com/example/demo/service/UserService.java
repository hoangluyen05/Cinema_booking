package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
}

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public User getByUsername(String username) {

    if (username == null || username.isEmpty()) {
        throw new RuntimeException("Email không hợp lệ");
    }

    return userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

    public User updateProfile(String username, UpdateUserRequest req) {

    if (username == null || username.isEmpty()) {
        throw new RuntimeException("Email không hợp lệ");
    }

    User user = getByUsername(username);

    user.setFullName(req.getFullName());
    user.setEmail(req.getEmail());

    return userRepository.save(user);
}

    public void changePassword(String email, ChangePasswordRequest request) {

    if (email == null || email.isEmpty()) {
        throw new RuntimeException("Email không hợp lệ");
    }

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new RuntimeException("Sai mật khẩu cũ");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
}
    public List<User> getCustomers(String name, String email) {
        if(name != null && email != null) {
            return userRepository.findByRoleAndFullNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
                "user", name, email
            );
        } else if(name != null) {
            return userRepository.findByRoleAndFullNameContainingIgnoreCase("user", name);
        } else if(email != null) {
            return userRepository.findByRoleAndEmailContainingIgnoreCase("user", email);
        }
        return userRepository.findByRole("user");
    }


    // Lấy thông tin 1 khách hàng theo id
    public User getCustomerById(Long id){
        return userRepository.findById(id).orElse(null);
    }
}