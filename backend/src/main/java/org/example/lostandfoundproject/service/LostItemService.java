package org.example.lostandfoundproject.service;

import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemSummaryDTO;
import org.example.lostandfoundproject.exception.DatabaseAccessException;
import org.example.lostandfoundproject.exception.NotFoundException;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.LostItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LostItemService {

    @Autowired
    UserService userService;

    @Autowired
    LostItemRepository lostItemRepository;

    private final Logger logger = LoggerFactory.getLogger(LostItemService.class);

    public LostItemDTO createLostItem(CreateLostItemDTO createDTO) {


        try {
            User user = userService.getUserEntityById(createDTO.user());

            LostItem entity = DTOMapper.toEntity(createDTO);
            entity.setUser(user);


            LostItemDTO saved = DTOMapper.toDTO(lostItemRepository.save(entity));

            logger.info("Lost item with name: " + saved.name() + " was successfully registered.");

            return saved;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Database constrain violation; " + e.getMessage());
        } catch (DataAccessException e) {
            throw new IllegalStateException("Database error; " + e.getMessage());
        }
    }

    public LostItemDTO getItemByID(int id) {
        try {
            LostItemDTO dto = DTOMapper.toDTO(lostItemRepository.findById(id).orElseThrow(() -> {
                return new NotFoundException("Failed to find item.");
            }));

            return dto;
        } catch (DataAccessException e) {
            logger.error("Failed to find item by ID: {}", id);
            throw new DatabaseAccessException("Failed to find item in system.");
        }
    }

    public List<LostItemDTO> getAllLostItems() {
        try {
            return DTOMapper.toDTOList(lostItemRepository.findAll());
        } catch (DataAccessException e) {
            logger.error("DB error when retrieving all lost items", e);
            throw new DatabaseAccessException("Failed to retrieve all lost items");
        }
    }


    public List<LostItemSummaryDTO> getAllUnreturned() {
        try {
            return DTOMapper.toSummaryDTOList(lostItemRepository.findAllByIsReturnedFalse());
        } catch (DataAccessException e) {
            logger.error("DB error when retrieving all lost items", e);
            throw new DatabaseAccessException("Failed to retrieve all unreturned items");
        }
    }

    public void deleteItemById(int id) {
        try {
            LostItem foundItem = lostItemRepository.findById(id)
                    .orElseThrow(() -> {
                        return new NotFoundException("Item with ID: " + id + " was not found.");
                    });

            lostItemRepository.delete(foundItem);
            logger.info("Item with ID: {} was succesfully deleted.", id);
        } catch (DataAccessException e) {
            logger.error("Failed to delete item with ID: {}", id, e);
            throw new DatabaseAccessException("Failed to delete item.");
        }
    }
}
