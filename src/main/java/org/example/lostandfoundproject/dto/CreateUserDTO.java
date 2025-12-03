package org.example.lostandfoundproject.dto;

import org.example.lostandfoundproject.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank(message = "Username must not be blank")
        @Size(min = 3, max = 50, message = "Username length must be between 3 and 50 characters")
        String username,

        @NotBlank(message = "First name must not be blank")
        @Size(min = 2, max = 50, message = "First name length must be between 2 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name must not be blank")
        @Size(min = 2, max = 50, message = "Last name length must be between 2 and 50 characters")
        String lastName,

        Role role,

        String rawPassword

) {
}
