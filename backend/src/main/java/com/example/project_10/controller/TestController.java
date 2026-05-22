package com.example.project_10.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



//Testovaci controller
@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Backend is running";
    }
}