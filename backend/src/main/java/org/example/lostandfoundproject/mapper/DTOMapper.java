package org.example.lostandfoundproject.mapper;

import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemSummaryDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.User;

import java.util.List;

public class DTOMapper {

    public static LostItem toEntity(CreateLostItemDTO dto) {
        return new LostItem(
                dto.name(),
                dto.description(),
                false,
                dto.placeFound(),
                dto.category(),
                dto.dateFound()
        );
    }


    // response
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
                toDTO(lostItem.getUser()),
                lostItem.getName(),
                lostItem.getDescription(),
                lostItem.isReturned(),
                lostItem.getPlaceFound(),
                lostItem.getCategory(),
                lostItem.getDateFound(),
                lostItem.getRegisteredAt()
        );
    }

    public static List<LostItemDTO> toDTOList(List<LostItem> lostItemList) {
        return lostItemList.stream()
                .map(item -> toDTO(item))
                .toList();
    }

    public static LostItemSummaryDTO toSummaryDTO(LostItem lostItem) {
        return new LostItemSummaryDTO(
                lostItem.getId(),
                lostItem.getName(),
                lostItem.getPlaceFound(),
                lostItem.getCategory(),
                lostItem.getDateFound()
        );
    }

    public static List<LostItemSummaryDTO> toSummaryDTOList(List<LostItem> lostItemList) {
        return lostItemList.stream()
                .map(item -> toSummaryDTO(item))
                .toList();
    }

}
