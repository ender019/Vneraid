package com.vneraid.botservice.dtos;

public record SendSessionDTO(
        Long id,
        String name,
        String group,
        Boolean imgPossible,
        Boolean videoPossible,
        Boolean audioPossible,
        Boolean linkPossible,
        Integer maxWarn,
        Boolean active
) {}
