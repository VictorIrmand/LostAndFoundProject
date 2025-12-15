package org.example.lostandfoundproject.unit.service;

import org.example.lostandfoundproject.dto.request.CreateUserDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.model.Role;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.example.lostandfoundproject.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    private User mockUser;

    @Mock
    UserRepository repo;

    @Mock
    PasswordEncoder passwordEncoder;


    @InjectMocks
    UserService userService;

    @BeforeEach
    void setUp() {
        mockUser = createUser(999, "username", Role.STAFF, "password");
    }

    // Happy path
    @Test
    void createUser_ShouldSaveEntityAndReturnDTO_whenDTOIsValid() {
        // arrange

        CreateUserDTO toBeSaved = new CreateUserDTO("username", "", "", Role.STAFF, "password");
        when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // act
        UserDTO saved = userService.createUser(toBeSaved);

        // assert
        assertNotNull(saved);
        assertEquals("username", saved.username());

        // verify
        Mockito.verify(repo, Mockito.times(1)).save(any(User.class));
    }


    // error path


    private User createUser(int id, String username, Role role, String passwordHash) {
        return new User(
                id,
                username,
                "",
                "",
                role,
                passwordHash
        );
    }
}
