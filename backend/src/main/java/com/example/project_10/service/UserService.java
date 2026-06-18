package com.example.project_10.service;

import com.example.project_10.dto.RegisterDto;
import com.example.project_10.dto.UserSearchDto;
import com.example.project_10.entity.User;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    public void register(RegisterDto reg) {
        if(userRepository.findByEmail(reg.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(reg.getEmail());
        user.setPassword(encoder.encode(reg.getPassword()));
        user.setName(reg.getName());
        user.setSurname(reg.getSurname());
        user.setDateOfBirth(reg.getBirthDate());
        user.setNickname(reg.getNickname());
        userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!encoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<UserSearchDto> searchByNickname(String query, String currentEmail) {
        List<UserSearchDto> result = new ArrayList<>();
        if (query == null || query.isBlank()) {
            return result; // prazdny dopyt -> prazdny zoznam
        }
        for (User u : userRepository.findByNicknameContainingIgnoreCase(query)) {
            if (u.getEmail().equals(currentEmail)) {
                continue; // seba nezobrazuj
            }
            result.add(new UserSearchDto(u.getId(), u.getNickname(), u.getName(), u.getSurname()));
        }
        return result;
    }
}