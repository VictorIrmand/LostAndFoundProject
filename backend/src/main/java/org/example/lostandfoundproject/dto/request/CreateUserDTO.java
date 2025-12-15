package org.example.lostandfoundproject.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.lostandfoundproject.model.Role;

public  record CreateUserDTO (
        @NotBlank(message = "Brugernavn må ikke stå tomt.")
        @Size(min = 3, max = 50, message = "Længde på brugernavn skal være mindst 3 tegn.")
        String username,
        @NotBlank(message = "Fornavn må ikke stå tomt.")
        String firstName,
        @NotBlank(message = "Efternavn må ikke stå tomt.")
        String lastName,

        @NotNull(message = "Rolle skal vælges")
        Role role,

        @NotBlank(message = "Password må ikke stå tomt.")
        @Size(min = 7, max = 50, message = "Længde på password skal være mindst 6 tegn.")
        String rawPassword
){
}
