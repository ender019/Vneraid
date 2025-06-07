package com.vneraid.botservice.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "warnings", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "session_id"})
})
public class Warning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Integer warns;

    @Column
    private Boolean baned;

    @Column(name = "user_id")
    private String user_id;

    @ManyToOne
    private Session session;
}
