package com.example.project_10.service;

import com.example.project_10.dto.MessageDto;
import com.example.project_10.dto.MessageResponseDto;
import com.example.project_10.entity.Message;
import com.example.project_10.entity.User;
import com.example.project_10.repository.MessageRepository;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageResponseDto sendMessage(MessageDto messageDto, Long senderId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found!"));
        User recipient = userRepository.findById(messageDto.getRecipientId()).orElseThrow(() -> new RuntimeException("Recipient not found!"));

        if (sender.getId().equals(recipient.getId())) {
            throw new RuntimeException("You cannot send a message to yourself!");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageDto.getContent());

        Message savedMessage = messageRepository.save(message);
        return toResponseDto(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDto> getConversation(Long currentUserId, Long otherUserId) {
        List<Message> messages = messageRepository.findConversation(currentUserId, otherUserId);
        List<MessageResponseDto> listDto = new ArrayList<>();
        for (Message message : messages) {
            listDto.add(toResponseDto(message));
        }
        return listDto;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDto> getInbox(Long userId) {
        List<Message> messages = messageRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        List<MessageResponseDto> listDto = new ArrayList<>();
        for (Message message : messages) {
            listDto.add(toResponseDto(message));
        }
        return listDto;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDto> getSent(Long userId) {
        List<Message> messages = messageRepository.findBySenderIdOrderByCreatedAtDesc(userId);
        List<MessageResponseDto> listDto = new ArrayList<>();
        for (Message message : messages) {
            listDto.add(toResponseDto(message));
        }
        return listDto;
    }

    private MessageResponseDto toResponseDto(Message message) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderNickname(message.getSender().getNickname());
        dto.setRecipientId(message.getRecipient().getId());
        dto.setRecipientNickname(message.getRecipient().getNickname());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
