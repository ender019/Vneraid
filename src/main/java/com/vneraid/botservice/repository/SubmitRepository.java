package com.vneraid.botservice.repository;

import com.vneraid.botservice.entities.Submit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmitRepository extends JpaRepository<Submit, Long> {
    public Optional<Submit> findSubmitByUserId(Long id);

    public Optional<Submit>  findSubmitByHash(String hash);
}
