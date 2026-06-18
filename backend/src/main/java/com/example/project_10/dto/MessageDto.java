package com.example.project_10.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDto {

    @NotNull(message = "Recipient must be provided!")
    private Long recipientId;

    @NotBlank(message = "Message cannot be empty!")
    @Size(min = 1, max = 1000, message = "Message must be between 1 and 1000 characters")
    private String content;
}
