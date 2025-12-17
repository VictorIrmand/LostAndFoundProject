package org.example.lostandfoundproject.controller;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.dto.request.LoginRequestDTO;
import org.example.lostandfoundproject.dto.response.UserDTO;
import org.example.lostandfoundproject.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO requestDTO, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                    requestDTO.username(),
                            requestDTO.rawPassword()
            )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);


            request.getSession(true);

            return ResponseEntity.ok("Succesfuld logget ind");
        } catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Forkert brugernavn eller adgangskode");
        }

    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDTO foundUser = userService.getUserByUsername(authentication.getName());

        return ResponseEntity.ok().body(foundUser);
    }



}
