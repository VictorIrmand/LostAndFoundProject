package org.example.lostandfoundproject.unit.service;

import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemSummaryDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.Role;
import org.example.lostandfoundproject.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DTOMapperTest {

    private User mockUser;
    private LostItem mockLostItem;
    private LocalDateTime fixedDateTime;

    @BeforeEach
    void setUp() {
        fixedDateTime = LocalDateTime.of(2025, 1, 15, 12, 0);

        // Mock User Entity
        mockUser = new User(1, "testuser", "Test", "Bruger", Role.STAFF, "hashedpassword");

        // Mock LostItem

        mockLostItem = new LostItem(
                101,
                mockUser,
                "iPhone 13",
                "Sort, med revne i skærmen",
                false,
                "FORHALLEN",
                fixedDateTime.minusDays(1),
                fixedDateTime,
                Category.ELEKTRONIK
        );
    }

    @Test
    void toDTO_ShouldMapUserEntityToUserDTO() {
        // Act
        UserDTO result = DTOMapper.toDTO(mockUser);

        // Assert
        assertNotNull(result);
        assertEquals(mockUser.getId(), result.id());
        assertEquals(mockUser.getUsername(), result.username());
        assertEquals(Role.STAFF, result.role());
    }

    @Test
    void toUserDTOList_ShouldMapListOfUserEntitiesToUserDTOList() {
        // Arrange
        User user2 = new User(2, "admin", "Admin", "User", Role.ADMIN, "hashedadminpass");
        List<User> userList = List.of(mockUser, user2);

        // Act
        List<UserDTO> resultList = DTOMapper.toUserDTOList(userList);

        // Assert
        assertEquals(2, resultList.size());
        assertEquals(user2.getUsername(), resultList.get(1).username());
    }


    @Test
    void toEntity_ShouldMapCreateLostItemDTOToLostItemEntity_WithReturnedFalse() {
        // Arrange
        CreateLostItemDTO dto = new CreateLostItemDTO(
                1,
                "Nøglebundt",
                "Med rød nøglering",
                "VINTERHAVEN",
                Category.ANDET,
                fixedDateTime.minusHours(2)
        );

        // Act
        LostItem result = DTOMapper.toEntity(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.name(), result.getName());
        assertEquals(dto.placeFound(), result.getPlaceFound());
        assertEquals(Category.ANDET, result.getCategory());
        assertEquals(dto.dateFound(), result.getDateFound());
        assertFalse(result.isReturned(), "Nyt item skal have 'returned' sat til false");
        assertNull(result.getUser(), "User skal sættes af service-laget, ikke DTOMapper.toEntity");

    }


    @Test
    void toDTO_ShouldMapLostItemEntityToLostItemDTO() {
        // Act
        LostItemDTO result = DTOMapper.toDTO(mockLostItem);

        // Assert
        assertNotNull(result);
        assertEquals(mockLostItem.getId(), result.id());
        assertEquals(mockLostItem.getRegisteredAt(), result.registeredAt());
        // tjekker at  UserDTO er korrekt mappet
        assertNotNull(result.user());
        assertEquals(mockUser.getUsername(), result.user().username());
    }

    @Test
    void toSummaryDTO_ShouldMapLostItemEntityToSummaryDTO() {
        // Act
        LostItemSummaryDTO result = DTOMapper.toSummaryDTO(mockLostItem);

        // Assert
        assertNotNull(result);
        assertEquals(mockLostItem.getId(), result.id());
        assertEquals(mockLostItem.getName(), result.name());
        assertEquals(mockLostItem.getPlaceFound(), result.placeFound());
        assertEquals(mockLostItem.getCategory(), result.category());
        assertEquals(mockLostItem.getDateFound(), result.dateFound());
    }
}