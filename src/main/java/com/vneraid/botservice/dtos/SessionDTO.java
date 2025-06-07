package com.vneraid.botservice.dtos;

import java.util.List;

public record SessionDTO(
    List<String> redSessions,
    List<String> lisSessions
) {}
