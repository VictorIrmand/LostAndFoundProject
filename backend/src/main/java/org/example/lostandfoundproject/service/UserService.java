package org.example.lostandfoundproject.service;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.exception.DatabaseAccessException;
import org.example.lostandfoundproject.exception.NotFoundException;
import org.example.lostandfoundproject.mapper.DTOMapper;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    UserRepository userRepository;


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

}
