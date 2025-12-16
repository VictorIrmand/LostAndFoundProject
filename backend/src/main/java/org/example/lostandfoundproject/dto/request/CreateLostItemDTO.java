package org.example.lostandfoundproject.dto.request;

import org.example.lostandfoundproject.model.Category;

import java.time.LocalDateTime;

public record CreateLostItemDTO (
    int user,
    String name,
    String description,
    String placeFound,
    Category category,
    LocalDateTime dateFound
){}
