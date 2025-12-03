package org.example.lostandfoundproject.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.dto.CreateUserDTO;
import org.example.lostandfoundproject.dto.UserDTO;
import org.example.lostandfoundproject.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) {
        System.out.println(">>> AdminController CREATE USER endpoint called");
        UserDTO saved = userService.createUser(createUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.username());
    }


}
