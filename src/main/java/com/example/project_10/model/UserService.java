package com.example.project_10.model;

import com.example.project_10.authentication.Register;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void register(Register reg) {

        if(userRepository.findByEmail(reg.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setEmail(reg.getEmail());

        String hashedPassword = encoder.encode(reg.getPassword());
        user.setPassword(hashedPassword);

        user.setAge(reg.getAge());
        user.setName(reg.getName());
        user.setSurname(reg.getSurname());
        user.setDateOfBirth(reg.getDate_of_birth());
        user.setNickname(reg.getNickname());

        userRepository.save(user);
    }
}