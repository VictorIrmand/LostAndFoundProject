package org.example.lostandfoundproject.dto;

public record LoginRequestDTO(
        String username,
        String rawPassword
) {
}
