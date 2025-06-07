package com.vneraid.botservice.dtos;

public record MessageDTO(
    String group_id,
    String user_id,
    String text,
    Boolean has_img,
    Boolean has_video,
    Boolean has_audio,
    Boolean has_link
) {}
