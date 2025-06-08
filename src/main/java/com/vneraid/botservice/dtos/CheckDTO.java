package com.vneraid.botservice.dtos;

public record CheckDTO (
        String user_id,
        String group_id,
        String text,
        Integer hiddenUrlCount,
        Boolean mediaAttachment,
        Boolean stickerOrGifPresent
) {}
