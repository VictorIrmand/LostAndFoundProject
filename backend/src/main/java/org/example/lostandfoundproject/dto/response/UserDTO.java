package org.example.lostandfoundproject.dto.response;

import org.example.lostandfoundproject.model.Role;

public record UserDTO(
        int id,
        String username,
        String firstName,
        String lastName,
        Role role
) {
}
