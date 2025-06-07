package com.vneraid.botservice.repository;

import com.vneraid.botservice.entities.Warning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarningRepository extends JpaRepository<Warning, Long> {
    @Query("select w from Warning w where w.user_id = :user_id")
    public Optional<Warning> findByUser_id(Long user_id);

}
