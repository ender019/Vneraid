package com.vneraid.botservice.dtos;

import java.time.LocalDateTime;

public record UserDTO(
    String username,
    String email,
    String tg_id,
    LocalDateTime created_at
) {}
