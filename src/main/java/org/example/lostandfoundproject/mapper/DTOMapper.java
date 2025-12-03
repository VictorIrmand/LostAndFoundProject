package org.example.lostandfoundproject.mapper;

import org.example.lostandfoundproject.dto.LostItemDTO;
import org.example.lostandfoundproject.dto.UserDTO;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.User;

import java.time.format.DateTimeFormatter;

public class DTOMapper {

    // user
    public static UserDTO toDTO(User user) {

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }

    public static LostItemDTO toDTO(LostItem lostItem) {

        return new LostItemDTO(
                lostItem.getId(),
                lostItem.getUser(),
                lostItem.getName(),
                lostItem.getDescription(),
                lostItem.isFound(),
                lostItem.getPlaceFound(),
                lostItem.getCategory()
        );
    }
}
