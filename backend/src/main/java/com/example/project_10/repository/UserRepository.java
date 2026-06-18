package com.example.project_10.repository;

import com.example.project_10.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);

    List<User> findByNicknameContainingIgnoreCase(String nickname);
}
