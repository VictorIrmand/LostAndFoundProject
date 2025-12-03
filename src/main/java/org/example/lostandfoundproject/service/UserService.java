package org.example.lostandfoundproject.service;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.dto.CreateUserDTO;
import org.example.lostandfoundproject.dto.UserDTO;
import org.example.lostandfoundproject.exception.DatabaseAccessException;
import org.example.lostandfoundproject.exception.DuplicateResourceException;
import org.example.lostandfoundproject.exception.NotFoundException;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public User getUserById(int id) {
        try {

            return userRepository.findById(id)
                    .orElseThrow(() ->
                            new NotFoundException("User not found") // logges i forvejen så id ikke nødvendig
                    );

        } catch (DataAccessException e) {
            throw new DatabaseAccessException("A system error occurred. Please try again later.");
        }
    }
    public UserDTO getUserByUsername(String username) {
        try {

            User foundUser = userRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new NotFoundException("User not found") // logges i forvejen så id ikke nødvendig
                    );

            return DTOMapper.toDTO(foundUser);
        } catch (DataAccessException e) {
            throw new DatabaseAccessException("A system error occurred. Please try again later.");
        }
    }

    public UserDTO createUser(CreateUserDTO createUserDTO) {
        try {
            String hashedPassword = passwordEncoder.encode(createUserDTO.rawPassword());
            System.out.println("CREATE USER CALLED");

            User user = new User(
                    0,
                    createUserDTO.username(),
                    createUserDTO.firstName(),
                    createUserDTO.lastName(),
                    createUserDTO.role(),
                    hashedPassword
            );

            User savedUser = userRepository.save(user);

            return DTOMapper.toDTO(savedUser);

        } catch (DataIntegrityViolationException e) {

            String msg = e.getMostSpecificCause().getMessage().toLowerCase();

            if (msg.contains("duplicate") || msg.contains("unique") || msg.contains("constraint")) {
                throw new DuplicateResourceException("Username already exists");
            }

            throw new DatabaseAccessException("A database constraint error occurred");
        }
    }
}
