package com.vneraid.botservice.dtos;

public record AiDTO(
        String text,
        Integer hiddenUrlCount,
        Boolean mediaAttachment,
        Boolean stickerOrGifPresent
) {}
