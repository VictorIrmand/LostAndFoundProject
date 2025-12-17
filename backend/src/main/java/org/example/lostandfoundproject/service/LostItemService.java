package org.example.lostandfoundproject.service;

import lombok.AllArgsConstructor;
import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.request.HandOutItemDTO;
import org.example.lostandfoundproject.dto.request.UpdateLostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemSummaryDTO;
import org.example.lostandfoundproject.exception.DatabaseAccessException;
import org.example.lostandfoundproject.exception.NotFoundException;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.HandoutEvent;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.HandoutEventRepository;
import org.example.lostandfoundproject.repository.LostItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class LostItemService {

    private final UserService userService;

    private final LostItemRepository repo;

    private final HandoutEventRepository handoutRepo;

    private final Logger logger = LoggerFactory.getLogger(LostItemService.class);


    @Transactional
    public LostItemDTO createLostItem(CreateLostItemDTO createDTO) {


        try {
            User user = userService.getUserEntityById(createDTO.user());

            LostItem entity = DTOMapper.toEntity(createDTO);
            entity.setUser(user);


            LostItemDTO saved = DTOMapper.toDTO(repo.save(entity));

            logger.info("Lost item with name: " + saved.name() + " was successfully registered.");

            return saved;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Database constrain violation; " + e.getMessage());
        } catch (DataAccessException e) {
            throw new DatabaseAccessException("Database error; " + e.getMessage());
        }
    }

    public LostItemDTO getItemByID(int id) {
        try {
            LostItemDTO dto = DTOMapper.toDTO(repo.findById(id).orElseThrow(() -> {
                return new NotFoundException("Failed to find item.");
            }));

            return dto;
        } catch (DataAccessException e) {
            logger.error("Failed to find item by ID: {}", id);
            throw new DatabaseAccessException("Failed to find item in system.");
        }
    }

    public LostItemDTO updateItemById(int id, UpdateLostItemDTO updateLostItemDTO) {

        try {
            LostItem foundItem = repo.findById(id)
                    .orElseThrow(() -> new NotFoundException("Item with ID " + id + " not found"));

            foundItem.setName(updateLostItemDTO.name());
            foundItem.setDescription(updateLostItemDTO.description());
            foundItem.setPlaceFound(updateLostItemDTO.placeFound());
            foundItem.setCategory(updateLostItemDTO.category());
            foundItem.setDateFound(updateLostItemDTO.dateFound());

            LostItem saved = repo.save(foundItem);

            logger.info("Lost item with ID {} was updated", id);

            return DTOMapper.toDTO(saved);

        } catch (DataAccessException e) {
            logger.error("Failed to update item with ID {}", id, e);
            throw new DatabaseAccessException("Failed to update item");
        }
    }

    public List<LostItemDTO> getAllLostItems() {
        try {
            return DTOMapper.toDTOList(repo.findAll());
        } catch (DataAccessException e) {
            logger.error("DB error when retrieving all lost items", e);
            throw new DatabaseAccessException("Failed to retrieve all lost items");
        }
    }

    @Transactional
    public void handOutItem(HandOutItemDTO dto) {
        try {

            User handedOutBy = userService.getUserEntityById(dto.handedOutBy());

            LostItem lostItem = repo.findById(dto.lostItem()).orElseThrow(() -> new NotFoundException("Failed to find item by ID: " + dto.lostItem()));

            if (lostItem.isReturned()) {
                throw new IllegalStateException("Item already handed out");
            }
            lostItem.setReturned(true);
            HandoutEvent handoutEvent = new HandoutEvent(lostItem, handedOutBy);


            LostItem saved = repo.save(lostItem);


            logger.info("Item with ID: {} is now handed out.", dto.lostItem());

            handoutRepo.save(handoutEvent);
        } catch (DataAccessException e) {
            logger.error(
                    "Database error while handing out itemId={} by userId={}",
                    dto.lostItem(),
                    dto.handedOutBy(),
                    e
            );
            throw new DatabaseAccessException("Internal database error while handing out item");
        }
    }


    public List<LostItemSummaryDTO> getAllUnreturned() {
        try {
            return DTOMapper.toSummaryDTOList(repo.findAllByIsReturnedFalse());
        } catch (DataAccessException e) {
            logger.error("DB error when retrieving all lost items", e);
            throw new DatabaseAccessException("Failed to retrieve all unreturned items");
        }
    }

    public void deleteItemById(int id) {
        try {
            LostItem foundItem = repo.findById(id)
                    .orElseThrow(() -> {
                        return new NotFoundException("Item with ID: " + id + " was not found.");
                    });

            if (foundItem.isReturned()) {
                HandoutEvent handoutEvent = handoutRepo.findByLostItemId(foundItem.getId())
                        .orElseThrow(() -> new NotFoundException("Failed to find handout event for item with ID: " + foundItem.getId()));
                handoutRepo.delete(handoutEvent);
            }


            repo.delete(foundItem);
            logger.info("Item with ID: {} was succesfully deleted.", id);
        } catch (DataAccessException e) {
            logger.error(
                    "Failed to delete LostItem id={} - rootCause={}",
                    id,
                    e.getMostSpecificCause(),
                    e
            );
            throw new DatabaseAccessException("Failed to delete item", e);
        }
    }

}
