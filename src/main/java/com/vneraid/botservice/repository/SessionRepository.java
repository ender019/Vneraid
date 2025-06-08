package com.vneraid.botservice.repository;

import com.vneraid.botservice.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    public Optional<Session> findSessionById(Long id);

    @Query("SELECT s FROM Session s WHERE s.group_id = :group_id")
    public Optional<Session> findSessionByGroup_id(String group_id);

    public Optional<Session> getSessionById(Long id);

    @Query("select s from Connection c join Session s on c.session.id = s.id where c.user.id = :id and c.role = :role")
    public List<Session> findRoleSessionByUserId(long id, String role);

    public void deleteSessionById(Long id);
}
