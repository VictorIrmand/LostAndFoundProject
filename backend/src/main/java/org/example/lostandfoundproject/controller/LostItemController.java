package org.example.lostandfoundproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.example.lostandfoundproject.dto.request.CreateLostItemDTO;
import org.example.lostandfoundproject.dto.request.HandOutItemDTO;
import org.example.lostandfoundproject.dto.request.UpdateLostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemDTO;
import org.example.lostandfoundproject.dto.response.LostItemSummaryDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.model.Category;
import org.example.lostandfoundproject.service.LostItemService;
import org.example.lostandfoundproject.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lost-items")
public class LostItemController {
    private final LostItemService lostItemService;
    private final static Logger logger = LoggerFactory.getLogger(LostItemController.class);

    // kan kun hentes af admin eller staff da den indeholder hemmelig info om items
    @GetMapping
    public ResponseEntity<List<LostItemDTO>> getAllLostItemsForStaff() {
        logger.info("Henter alle items");
        return ResponseEntity.ok(lostItemService.getAllLostItems());
    }

    @GetMapping("/public")
    public ResponseEntity<List<LostItemSummaryDTO>> getAllUnreturnedSummary() {
        return ResponseEntity.ok(lostItemService.getAllUnreturned());
    }


    @PostMapping
    public ResponseEntity<LostItemDTO> createLostItem(@Valid @RequestBody CreateLostItemDTO dto) {
        LostItemDTO created = lostItemService.createLostItem(dto);
        logger.info("Smider dto videre: " + created);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


        @PutMapping("/{id}")
    public ResponseEntity<LostItemDTO> updateLostItem(@PathVariable int id, @RequestBody UpdateLostItemDTO updateLostItemDTO){
        LostItemDTO updated = lostItemService.updateItemById(id, updateLostItemDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LostItemDTO> viewLostItem(@PathVariable int id) {
        return ResponseEntity.ok().body(lostItemService.getItemByID(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> categories() {

        List<Category> list = List.of(Category.values());

        return ResponseEntity.ok().body(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable int id) {
        lostItemService.deleteItemById(id);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/handout")
    public ResponseEntity<?> handOutItem(@RequestBody HandOutItemDTO dto) {
        lostItemService.handOutItem(dto);
        return ResponseEntity.ok().build();
    }


}
