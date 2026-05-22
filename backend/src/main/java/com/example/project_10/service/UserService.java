package com.example.project_10.service;

import com.example.project_10.dto.RegisterDto;
import com.example.project_10.entity.User;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Invalid email"));
        boolean passwordIsValid = encoder.matches(password, user.getPassword());
        if(passwordIsValid) {
            return user;
        }else {
            throw new UsernameNotFoundException("Invalid password");
        }
    }
}