package com.vneraid.botservice.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submit")
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
}
