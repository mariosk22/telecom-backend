package com.example.project_10.controller;

import com.example.project_10.dto.ConversationDto;
import com.example.project_10.dto.MessageDto;
import com.example.project_10.dto.MessageResponseDto;
import com.example.project_10.entity.User;
import com.example.project_10.exception.ApiException;
import com.example.project_10.service.MessageService;
import com.example.project_10.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> sendMessage(@Valid @RequestBody MessageDto request, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        MessageResponseDto created = messageService.sendMessage(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.ok(messageService.getConversations(currentUser.getId()));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageResponseDto>> getConversation(@PathVariable Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.ok(messageService.getConversation(currentUser.getId(), userId));
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<MessageResponseDto>> getInbox(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.ok(messageService.getInbox(currentUser.getId()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MessageResponseDto>> getSent(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found!"));
        return ResponseEntity.ok(messageService.getSent(currentUser.getId()));
    }
}
