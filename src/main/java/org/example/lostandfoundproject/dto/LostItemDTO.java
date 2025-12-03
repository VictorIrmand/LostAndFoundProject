package org.example.lostandfoundproject.dto;

import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.model.Place;
import org.example.lostandfoundproject.model.User;


public record LostItemDTO(
        int id,
        User user,
        String name,
        String description,
        boolean isFound,
        Place placeFound,
        Category category
) {
}
