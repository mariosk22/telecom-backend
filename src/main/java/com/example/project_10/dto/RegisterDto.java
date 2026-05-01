package com.example.project_10.dto;

import jakarta.validation.constraints.*;


import java.time.LocalDate;

public class RegisterDto {

    @NotNull(message = "Dátum narodenia nesmie byť prázdny")
    @Past(message = "Dátum narodenia musí byť v minulosti")
    private LocalDate birthDate;

    @NotBlank(message = "Email nesmie byť prázdny")
    @Email(message = "Neplatný formát emailu")
    private String email;

    @NotBlank(message = "Meno nesmie byť prázdne")
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank(message = "Prezývka nesmie byť prázdna")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Prezývka môže obsahovať iba písmená a číslice")
    private String nickname;

    @NotBlank(message = "Heslo nesmie byť prázdne")
    @Size(min = 8, message = "Heslo musí mať aspoň 8 znakov")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$",
            message = "Heslo musí obsahovať veľké písmeno, číslo a špeciálny znak"
    )
    private String password;

    @NotBlank(message = "Priezvisko nesmie byť prázdne")
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
