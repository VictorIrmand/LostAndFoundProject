package org.example.lostandfoundproject.dto.response;

import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.model.User;

import java.time.LocalDateTime;

public record LostItemSummaryDTO(
        int id,
        String name,
        String placeFound,
        Category category,
        LocalDateTime dateFound
) {
}