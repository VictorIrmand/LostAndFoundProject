package org.example.lostandfoundproject.integration;


import org.example.lostandfoundproject.dto.request.HandOutItemDTO;
import org.example.lostandfoundproject.model.*;
import org.example.lostandfoundproject.repository.HandoutEventRepository;
import org.example.lostandfoundproject.repository.LostItemRepository;
import org.example.lostandfoundproject.repository.UserRepository;
import org.example.lostandfoundproject.service.LostItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class LostItemServiceIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LostItemService service;

    @Autowired
    private LostItemRepository repo;

    @Autowired
    private HandoutEventRepository handoutRepo;

    private User user;
    private LostItem item;

    @BeforeEach
    void setUp() {
        user = userRepository.save(
                new User(0, "admin", "Admin", "User", Role.ADMIN, "hash")
        );

        item = new LostItem(
                "Wallet",
                "Black wallet",
                false,
                "Front desk",
                Category.ANDET,
                LocalDateTime.now()
        );
        item.setUser(user);
        item = repo.save(item);
    }



    @Test
    void handOutItem_updatesLostItem_and_createsHandoutEvent() {

        // arrange
        HandOutItemDTO dto = new HandOutItemDTO(item.getId(), user.getId());


        // act
        service.handOutItem(dto);
        // assert
        LostItem lostItem = repo.findById(item.getId()).orElseThrow();
        assertTrue(lostItem.isReturned());

        HandoutEvent handoutEvent = handoutRepo.findByLostItemId(lostItem.getId()).orElseThrow();
        assertNotNull(handoutEvent);
        assertEquals(item.getId(), handoutEvent.getLostItem().getId());
        assertEquals(user.getId(), handoutEvent.getHandedOutBy().getId());
    }


}
