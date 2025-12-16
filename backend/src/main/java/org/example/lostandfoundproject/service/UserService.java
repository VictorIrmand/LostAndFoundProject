package org.example.lostandfoundproject.service;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.dto.request.CreateUserDTO;
import org.example.lostandfoundproject.dto.request.UpdateUserDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.exception.DatabaseAccessException;
import org.example.lostandfoundproject.exception.DuplicateResourceException;
import org.example.lostandfoundproject.exception.NotFoundException;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final static Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;

    public User getUserEntityById(int id) {
        try {

            return userRepository.findById(id)
                    .orElseThrow(() ->
                            new NotFoundException("User not found") // logges i forvejen så id ikke nødvendig
                    );

        } catch (DataAccessException e) {
            throw new DatabaseAccessException("A system error occurred. Please try again later.");
        }
    }

    public UserDTO getUserDTOById(int id) {
        return DTOMapper.toDTO(getUserEntityById(id));
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

    public List<UserDTO> getAllUsers() {
        try {
            return DTOMapper.toUserDTOList(userRepository.findAll());
        } catch (DataAccessException e) {
            logger.error("Error when retrieving all items.", e);
            throw new DatabaseAccessException("Error when retrieving all users");
        }
    }


    public void deleteUser(int id) {
        try {
            User user = getUserEntityById(id);

            userRepository.delete(user);
            logger.info("User with ID: {} was deleted successfully", id);
        } catch (DatabaseAccessException e) {
            logger.error("Error when deleting items with ID: {}", id, e);
            throw new DatabaseAccessException("Error when deleting user");
        }
    }

    @Transactional
    public UserDTO createUser(CreateUserDTO dto) {
        try {
            String hashedPassword = passwordEncoder.encode(dto.rawPassword());
            User user = new User();


            user.setUsername(dto.username());
            user.setFirstName(dto.firstName());
            user.setLastName(dto.lastName());

            user.changeRole(dto.role()); // Altid en USER
            user.changePasswordHash(hashedPassword);


            UserDTO saved = DTOMapper.toDTO(userRepository.save(user));
            logger.info("User with id: {} was signed up successfully", saved.id());
            return saved;

        } catch (DataIntegrityViolationException e) {
            String msg = e.getMostSpecificCause().getMessage().toLowerCase();

            logger.error("Constraint violation while creating user", e);

            if (msg.contains("username")) {
                throw new DuplicateResourceException(
                        "Der findes allerede en bruger med samme brugernavn"
                );
            }

            throw new DatabaseAccessException(
                    "Database constraint error while creating user."
            );
        }
    }


    @Transactional
    public UserDTO updateUser(UpdateUserDTO dto) {

        logger.info(
                "Updating user id={}, username={}, role={}",
                dto.id(),
                dto.username(),
                dto.role()
        );

        User user = getUserEntityById(dto.id());

        user.setUsername(dto.username());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.changeRole(dto.role());

        if (dto.rawPassword() != null && !dto.rawPassword().isBlank()) {
            user.changePasswordHash(passwordEncoder.encode(dto.rawPassword()));
        }

        return DTOMapper.toDTO(user);
    }

}
