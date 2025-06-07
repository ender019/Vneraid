package com.vneraid.botservice.repository;

import com.vneraid.botservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findUserById(Long id);

    @Query("select u from User u where u.tg_id = :tg_id")
    public Optional<User> findUserByTg_id(String tg_id);
}
