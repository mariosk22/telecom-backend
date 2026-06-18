package com.example.project_10.repository;

import com.example.project_10.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :userAId AND m.recipient.id = :userBId) OR " +
            "(m.sender.id = :userBId AND m.recipient.id = :userAId) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("userAId") Long userAId, @Param("userBId") Long userBId);

    List<Message> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    List<Message> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findAllForUser(@Param("userId") Long userId);
}
