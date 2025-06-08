package com.vneraid.botservice.dtos;

public record AddSessionDTO(
    String group_id,
    String user_id,
    String group_name
) {}
