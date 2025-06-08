package com.vneraid.botservice.dtos;

import java.util.List;

public record SessionDTO(
    List<SendSessionDTO> redSessions,
    List<SendSessionDTO> lisSessions
) {}
