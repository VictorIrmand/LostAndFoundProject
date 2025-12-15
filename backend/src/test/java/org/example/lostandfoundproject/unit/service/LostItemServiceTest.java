package org.example.lostandfoundproject.unit.service;

import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.request.HandOutItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.model.*;
import org.example.lostandfoundproject.repository.HandoutEventRepository;
import org.example.lostandfoundproject.repository.LostItemRepository;
import org.example.lostandfoundproject.service.LostItemService;
import org.example.lostandfoundproject.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LostItemServiceTest {

    private LostItem mockItem;
    private User mockUser;
    private LocalDateTime randomDate = LocalDateTime.of(2025, 1, 1, 12, 0);
    @Mock
    LostItemRepository repo;

    @Mock
    HandoutEventRepository handoutRepo;

    @Mock
    UserService userService;


    @InjectMocks
    LostItemService service;

    @BeforeEach
    void setUp() {
        mockItem = createLostItem(
                999,
                createUser(999, Role.ADMIN)

        );

        mockUser = createUser(999, Role.ADMIN);

    }


    // happy path
    @Test
    void createLostItem_shouldSaveEntityAndReturnDTO_WhenUserExists() {
        // arrange
        User mockAdminUser = mockUser;
        when(userService.getUserEntityById(anyInt())).thenReturn(mockAdminUser);
        CreateLostItemDTO toBeSaved = new CreateLostItemDTO(999, "item", "description", "placefound", Category.ANDET, randomDate);
        when(repo.save(any(LostItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // act
        LostItemDTO savedItem = service.createLostItem(toBeSaved);

        // assert
        assertNotNull(savedItem);
        assertEquals("item", savedItem.name());
        assertEquals(Category.ANDET, savedItem.category());

        // verify
        Mockito.verify(repo, Mockito.times(1)).save(any(LostItem.class));
    }

    @Test
    void handOutLostItem_shouldSaveHandoutEvent_AndMarkItemAsReturned() {
        // arrange
        LostItem itemToHandOut = mockItem;
        User mockAdminUser = mockUser;
        when(userService.getUserEntityById(anyInt())).thenReturn(mockAdminUser);
        when(repo.findById(anyInt())).thenReturn(Optional.ofNullable(itemToHandOut));
        when(repo.save(any(LostItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        HandOutItemDTO handOutItemDTO = new HandOutItemDTO(999, 999);

        when(handoutRepo.save(any(HandoutEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // act
        service.handOutItem(handOutItemDTO);

        // assert
        assertTrue(itemToHandOut.isReturned());

        // verify
        Mockito.verify(handoutRepo, Mockito.times(1)).save(any(HandoutEvent.class));
        Mockito.verify(repo, Mockito.times(1)).save(any(LostItem.class));
    }


    // error


    private LostItem createLostItem(int id, User user) {
        return new LostItem(
                id,
                user,
                "item",
                "description...",
                false,
                "",
                randomDate,
                randomDate,
                Category.ANDET

        );
    }

    private User createUser(int id, Role role) {
        return new User(
                id,
                "username",
                "firstname",
                "latname",
                role,
                "password"
        );
    }


}
