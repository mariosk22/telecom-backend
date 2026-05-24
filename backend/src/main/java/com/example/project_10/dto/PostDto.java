package com.example.project_10.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDto {

    @NotBlank(message = "Obsah nesmie byť prázdny")
    @Size(min = 1, max = 1000, message = "Obsah musí mať 1 až 1000 znakov")
    private String content;
}
