package org.example.lostandfoundproject.service;

import org.example.lostandfoundproject.dto.LostItemDTO;
import org.example.lostandfoundproject.dto.UserDTO;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.LostItem;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.LostItemRepository;
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

    public LostItemDTO createLostItem(LostItemDTO lostItemDTO, UserDTO userDTO) {
        User user = userService.getUserById(userDTO.id());

        try {
            LostItem lostItem = new LostItem(
                    lostItemDTO.name(),
                    lostItemDTO.description(),
                    lostItemDTO.isFound(),
                    lostItemDTO.placeFound(),
                    lostItemDTO.category()
            );
            lostItem.setUser(user);

            return DTOMapper.toDTO(lostItemRepository.save(lostItem));
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Database constrain violation; " + e.getMessage());
        }
        catch (DataAccessException e) {
            throw new IllegalStateException("Database error; " + e.getMessage());
        }
    }

    public List<LostItemDTO> getAllLostItems() {
        List<LostItem> lostItems = lostItemRepository.findAll();
        List<LostItemDTO> dtoList = new ArrayList<>();

        for (LostItem lostItem : lostItems) {
            LostItemDTO dto = DTOMapper.toDTO(lostItem);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
