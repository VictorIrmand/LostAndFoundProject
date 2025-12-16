package org.example.lostandfoundproject.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.example.lostandfoundproject.dto.request.LoginRequestDTO;
import org.example.lostandfoundproject.model.Role;
import org.example.lostandfoundproject.model.User;
import org.example.lostandfoundproject.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
public class AuthControllerIntegrationTest {

    private MockMvc mockMvc;

    // Manuel initialisering af ObjectMapper
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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


        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    // login test 1 sucess og 1 fejl

    @Test
    void login_ShouldReturnOk_AndSetSessionCookie_OnSuccess() throws Exception {
        // Arrange
        LoginRequestDTO requestDTO = new LoginRequestDTO(TEST_USERNAME, TEST_RAW_PASSWORD);

        // Act & Assert
        MvcResult result = mockMvc.perform(post(API_URL + "/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Succesfuld logget ind"))
                .andReturn();

        assertNotNull(result.getResponse().getCookie("JSESSIONID"), "JSESSIONID cookie skal sættes.");
    }

    @Test
    void login_ShouldReturnUnauthorized_OnBadCredentials() throws Exception {
        // Arrange
        LoginRequestDTO requestDTO = new LoginRequestDTO(TEST_USERNAME, "wrongpassword");

        // Act & Assert
        mockMvc.perform(post(API_URL + "/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Forkert brugernavn eller adgangskode"));
    }

    // /me test 1 succes 1 fejl

    @Test
    void me_ShouldReturnUserDTO_OnAuthenticatedUser() throws Exception {
        // log ind for at få en gyldig session
        LoginRequestDTO loginDTO = new LoginRequestDTO(TEST_USERNAME, TEST_RAW_PASSWORD);


        MvcResult loginResult = mockMvc.perform(post(API_URL + "/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        // henter session cookien
        String sessionId = loginResult.getResponse().getCookie("JSESSIONID").getValue();

        // opret et cookie-objekt for .cookie() metoden
        Cookie sessionCookie = new Cookie("JSESSIONID", sessionId);

        //  /me anmodning med den gyldige session-cookie
        mockMvc.perform(get(API_URL + "/me")
                        .cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value(TEST_USERNAME))
                .andExpect(jsonPath("$.role").value(Role.STAFF.name()));
    }

    @Test
    void me_ShouldReturnUnauthorized_OnUnauthenticatedUser() throws Exception {
        // Act uden session/cookie
        mockMvc.perform(get(API_URL + "/me"))
                .andExpect(status().isUnauthorized());
    }
}