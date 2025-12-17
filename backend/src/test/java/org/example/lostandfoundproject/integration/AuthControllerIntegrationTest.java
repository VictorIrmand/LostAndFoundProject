package org.example.lostandfoundproject.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.lostandfoundproject.dto.request.LoginRequestDTO;
import org.example.lostandfoundproject.model.Role;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String API_URL = "/api/auth";
    private final String TEST_USERNAME = "teststaff";
    private final String TEST_RAW_PASSWORD = "password123";

    @BeforeEach
    void setUp() {
        User user = new User(
                0,
                TEST_USERNAME,
                "Test",
                "Staff",
                Role.STAFF,
                passwordEncoder.encode(TEST_RAW_PASSWORD)
        );
        userRepository.save(user);
    }

    // -------- LOGIN --------

    @Test
    void login_ShouldReturnOk_AndCreateSession_OnSuccess() throws Exception {
        LoginRequestDTO dto =
                new LoginRequestDTO(TEST_USERNAME, TEST_RAW_PASSWORD);

        MvcResult result = mockMvc.perform(post(API_URL + "/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Succesfuld logget ind"))
                .andReturn();

        assertNotNull(
                result.getRequest().getSession(false),
                "Session skal være oprettet efter login"
        );
    }

    @Test
    void login_ShouldReturnUnauthorized_OnBadCredentials() throws Exception {
        LoginRequestDTO dto =
                new LoginRequestDTO(TEST_USERNAME, "wrongpassword");

        mockMvc.perform(post(API_URL + "/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Forkert brugernavn eller adgangskode"));
    }

    // -------- /ME --------

    @Test
    void me_ShouldReturnUserDTO_WhenAuthenticated() throws Exception {
        // login først
        MvcResult loginResult = mockMvc.perform(post(API_URL + "/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new LoginRequestDTO(TEST_USERNAME, TEST_RAW_PASSWORD)
                        )))
                .andExpect(status().isOk())
                .andReturn();

        mockMvc.perform(get(API_URL + "/me")
                        .session((MockHttpSession) loginResult.getRequest().getSession()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value(TEST_USERNAME))
                .andExpect(jsonPath("$.role").value(Role.STAFF.name()));
    }

    @Test
    void me_ShouldReturnUnauthorized_WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get(API_URL + "/me"))
                .andExpect(status().isUnauthorized());
    }
}
