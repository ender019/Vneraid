package com.vneraid.botservice.repository;

import com.vneraid.botservice.entities.Connection;
import com.vneraid.botservice.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    public List<Connection> findConnectionByUserId(long botId);
}
