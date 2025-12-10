package org.example.lostandfoundproject.dto.response;

import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.model.User;

import java.time.LocalDateTime;


public record LostItemDTO(
        int id,
        UserDTO user,
        String name,
        String description,
        boolean isReturned,
        String placeFound,
        Category category,
        LocalDateTime dateFound,
        LocalDateTime registeredAt
) {
}
