package com.vneraid.botservice.services;

import com.vneraid.botservice.dtos.*;
import com.vneraid.botservice.entities.Connection;
import com.vneraid.botservice.entities.Session;
import com.vneraid.botservice.repository.ConnectionRepository;
import com.vneraid.botservice.repository.SessionRepository;
import com.vneraid.botservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AppService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private ConnectionRepository connectionRepository;

    @Transactional
    public void setSettings(long id, SettingsDTO settings) {
        var ses = sessionRepository.findSessionById(id).orElseThrow();
        ses.setSession_name(settings.name());
        ses.setImgPossible(settings.imgPossible());
        ses.setVideoPossible(settings.videoPossible());
        ses.setAudioPossible(settings.audioPossible());
        ses.setLinkPossible(settings.linkPossible());
        ses.setMaxWarn(settings.maxWarn());
        ses.setActive(settings.active());
        sessionRepository.save(ses);
    }

    public SettingsDTO getSettings(Long id) {
        var res = sessionRepository.findById(id).orElseThrow();
        return new SettingsDTO(res.getSession_name(), res.getGroup_name(), res.getImgPossible(), res.getVideoPossible(),
                res.getAudioPossible(), res.getLinkPossible(), res.getMaxWarn(), res.getActive());
    }

    public SessionDTO getSession(Long id) {
        var admins = sessionRepository.findRoleSessionByUserId(id, "admin");
        var members = sessionRepository.findRoleSessionByUserId(id, "member");
        var out1 = admins.stream().map(el -> new SendSessionDTO(el.getId(), el.getSession_name(), el.getGroup_name(),
                el.getImgPossible(), el.getVideoPossible(), el.getAudioPossible(), el.getLinkPossible(), el.getMaxWarn(),
                el.getActive())).toList();
        var out2 = members.stream().map(el -> new SendSessionDTO(el.getId(), el.getGroup_name(), el.getSession_name(),
                el.getImgPossible(), el.getVideoPossible(), el.getAudioPossible(), el.getLinkPossible(), el.getMaxWarn(),
                el.getActive())).toList();
        return new SessionDTO(out1, out2);
    }

    public UserDTO getUser(Long id) {
        var res = userRepository.findUserById(id).orElseThrow();
        return new UserDTO(res.getUsername(), res.getEmail(), res.getTg_id(), res.getCreated_at());
    }

    @Transactional
    public void addSession(Long user_id, Long session_id, String role) {
        var ses = sessionRepository.getSessionById(user_id).orElseThrow();
        var user = userRepository.findUserById(session_id).orElseThrow();
        connectionRepository.save(new Connection(user, ses, "admin"));
    }


    public List<CollabaratorsDTO> getCollaborators(Long id) {
        var res = connectionRepository.findConnectionByUserId(id);
        return res.stream().map(el -> new CollabaratorsDTO(el.getId(), el.getUser().getUsername(), el.getRole()))
                .toList();
    }
}
