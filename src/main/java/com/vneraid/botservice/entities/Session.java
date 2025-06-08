package com.vneraid.botservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "sessions")
@NoArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String session_name;

    @Column
    private String group_name;

    @Column(unique=true, name = "group_id")
    private String group_id;

    @Column
    private LocalDateTime created_at;

    @Column(name = "img_possible")
    private Boolean imgPossible;

    @Column(name = "video_possible")
    private Boolean videoPossible;

    @Column(name = "audio_possible")
    private Boolean audioPossible;

    @Column(name = "link_possible")
    private Boolean linkPossible;

    @Column(name = "max_warn")
    private Integer maxWarn;

    @Column
    private Boolean active;

    @OneToMany(mappedBy = "session", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<Connection> connections;

    public Session(String group_id, String group_name) {
        this.session_name = group_name;
        this.group_name=group_name;
        this.group_id = group_id;
        this.created_at = LocalDateTime.now();
        this.imgPossible = true;
        this.videoPossible = true;
        this.audioPossible = true;
        this.linkPossible = true;
        this.maxWarn = -1;
        this.active = true;
    }

}
