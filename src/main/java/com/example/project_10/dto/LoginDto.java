package com.example.project_10.dto;

import jakarta.validation.constraints.*;

public class LoginDto {

    @NotBlank(message = "Email nesmie byť prázdny")
    @Email(message = "Neplatný formát emailu")
    private String email;

    @NotBlank(message = "Heslo nesmie byť prázdne")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
