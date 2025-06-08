package com.vneraid.botservice.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column
    private String email;

    @Column(unique=true)
    private String tg_id;

    @Column
    private LocalDateTime created_at;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<Connection> connections;
}
