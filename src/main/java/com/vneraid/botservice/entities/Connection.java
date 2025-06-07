package com.vneraid.botservice.entities;

import com.vneraid.botservice.entities.Session;
import com.vneraid.botservice.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@Table(name = "connection", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "session_id"})
})
@NoArgsConstructor
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column
    private String role;

    public Connection(User user, Session session, String role) {
        this.user = user;
        this.session = session;
        this.role = role;
    }
}
