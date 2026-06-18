package com.example.project_10.service;

import com.example.project_10.dto.ConversationDto;
import com.example.project_10.dto.MessageDto;
import com.example.project_10.dto.MessageResponseDto;
import com.example.project_10.entity.Message;
import com.example.project_10.entity.User;
import com.example.project_10.exception.ApiException;
import com.example.project_10.repository.MessageRepository;
import com.example.project_10.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageResponseDto sendMessage(MessageDto messageDto, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sender not found!"));
        User recipient = userRepository.findById(messageDto.getRecipientId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Recipient not found!"));

        if (sender.getId().equals(recipient.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot send a message to yourself!");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageDto.getContent());

        Message savedMessage = messageRepository.save(message);
        return toResponseDto(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(Long currentUserId) {
        List<Message> messages = messageRepository.findAllForUser(currentUserId); // najnovsie prve
        Map<Long, ConversationDto> byPartner = new LinkedHashMap<>();              // zachova poradie

        for (Message m : messages) {
            boolean iAmSender = m.getSender().getId().equals(currentUserId);
            User other = iAmSender ? m.getRecipient() : m.getSender();

            // prvy vyskyt partnera = jeho najnovsia sprava (zoznam je zoradeny zostupne)
            if (!byPartner.containsKey(other.getId())) {
                byPartner.put(other.getId(), new ConversationDto(
                        other.getId(),
                        other.getNickname(),
                        m.getContent(),
                        m.getCreatedAt(),
                        iAmSender
                ));
            }
        }
        return new ArrayList<>(byPartner.values());
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
