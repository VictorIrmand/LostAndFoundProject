package org.example.lostandfoundproject.dto.request;

public record LoginRequestDTO(
        String username,
        String rawPassword
) {
}
