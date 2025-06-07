package com.vneraid.botservice.dtos;

import java.time.LocalDateTime;

public record UserDTO(
    String username,
    String email,
    LocalDateTime created_at
) {}
