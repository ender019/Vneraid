package com.vneraid.botservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "submits")
@NoArgsConstructor
public class Submit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String hash;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @OneToOne
    private User user;

    public Submit(String hash, LocalDateTime deadline, User user) {
        this.hash = hash;
        this.deadline = deadline;
        this.user = user;
    }
}
