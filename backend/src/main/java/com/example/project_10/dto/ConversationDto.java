package com.example.project_10.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private Long userId;               // ten druhy pouzivatel
    private String nickname;           // jeho prezyvka
    private String lastMessage;        // text poslednej spravy
    private LocalDateTime lastMessageAt;
    private boolean lastMessageFromMe; // true = poslednu spravu som poslal ja
}
