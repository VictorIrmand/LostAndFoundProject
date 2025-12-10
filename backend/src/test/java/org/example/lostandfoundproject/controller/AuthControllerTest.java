package org.example.lostandfoundproject.controller;

import org.example.lostandfoundproject.dto.request.LoginRequestDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthController authController;

    @Test
    void login_ShouldReturnOk_WhenCredentialsAreCorrect() {
        LoginRequestDTO requestDTO = new LoginRequestDTO("Kevin", "Password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("Kevin", "Password"));

        MockHttpServletRequest request = new MockHttpServletRequest();

        ResponseEntity<?> response = authController.login(requestDTO, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Succesfuld logget ind", response.getBody());
    }

}