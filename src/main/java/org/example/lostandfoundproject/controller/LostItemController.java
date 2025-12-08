package org.example.lostandfoundproject.controller;

import org.example.lostandfoundproject.dto.LostItemDTO;
import org.example.lostandfoundproject.dto.UserDTO;
import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.service.LostItemService;
import org.example.lostandfoundproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lostitem")
public class LostItemController {

    @Autowired
    LostItemService lostItemService;

    @Autowired
    UserService userService;

    @GetMapping("/lostitems")
    public ResponseEntity<?> getAllLostItems() {
        return ResponseEntity.ok(lostItemService.getAllLostItems());
    }

    @PostMapping("/lostitem")
    public ResponseEntity<?> createLostItem(@RequestBody LostItemDTO lostItemDTO, Authentication authentication){
        UserDTO user = userService.getUserByUsername(authentication.getName());
        lostItemService.createLostItem(lostItemDTO,user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/category")
    public Category[] categories() {
        return Category.values();
    }


}
