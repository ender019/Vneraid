package com.vneraid.botservice.dtos;


public record SettingsDTO (
    String name,
    Boolean imgPossible,
    Boolean videoPossible,
    Boolean audioPossible,
    Boolean linkPossible,
    Integer maxWarn,
    Boolean active
) {}
