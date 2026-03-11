package com.example.project_10.model;

import com.example.project_10.authentication.Register;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void register(Register reg) {
        if(userRepository.findByEmail(reg.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(reg.getEmail());
        user.setPassword(reg.getPassword());
        user.setAge(reg.getAge());
        user.setName(reg.getName());
        user.setSurname(reg.getSurname());
        user.setDateOfBirth(reg.getDate_of_birth());
        user.setNickname(reg.getNickname());
        userRepository.save(user);
    }
}
