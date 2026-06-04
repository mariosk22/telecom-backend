package com.example.project_10.dto;

import jakarta.validation.constraints.*;


import java.time.LocalDate;
import java.time.Period;

public class RegisterDto {

    @NotNull(message = "Date of birth cannot be empty!")
    @Past(message = "Date of birth must be in the past!")
    private LocalDate birthDate;

    @AssertTrue(message = "You must be at least 15 years old!")
    public boolean isAgeValid() {
        if (birthDate == null) return true;
        return Period.between(birthDate, LocalDate.now()).getYears() >= 15;
    }

    @NotBlank(message = "Email cannot be empty!")
    @Email(message = "Invalid email format!")
    private String email;

    @NotBlank(message = "Name cannot be empty!")
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank(message = "Nickname cannot be empty!")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Nickname can only contains numbers and letters")
    private String nickname;

    @NotBlank(message = "Password cannot be empty!")
    @Size(min = 8, message = "Password must be at least 8 characters long!")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$",
            message = "Password must contains capital letters, numbers and special characters!"
    )
    private String password;

    @NotBlank(message = "Surname cannot be empty! ")
    @Size(min = 2, max = 50)
    private String surname;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
