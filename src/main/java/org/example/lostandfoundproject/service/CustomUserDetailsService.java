package org.example.lostandfoundproject.service;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.repository.UserRepository;
import org.example.lostandfoundproject.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Prøv at finde bruger via username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Bruger ikke fundet: " + username));

        // Returnér en Spring Security UserDetails
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) // gemmer altid username som "principal"
                .password(user.getPasswordHash())     // password SKAL være hash’et (fx BCrypt)
                .roles(user.getRole().name().replace("ROLE_", "")) // fx "USER" eller "ADMIN"
                .build();
    }
}
