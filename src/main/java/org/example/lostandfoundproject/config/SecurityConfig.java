package org.example.lostandfoundproject.config;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF er slået fra for at Postman kan sende POST/PUT
                .csrf(csrf -> csrf.disable())

                // Session-baseret login
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // Autorisation
                .authorizeHttpRequests(req -> req
                        .requestMatchers(
                                "/", "/index.html",
                                "/css/**", "/js/**", "/images/**",
                                "/login", "/signup"
                        ).permitAll()

                        .requestMatchers("/api/auth/**").permitAll()

                        // GET af lost items er offentligt
                        .requestMatchers(HttpMethod.GET, "/api/lostitem/**").permitAll()

                        // Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // POST/PUT/DELETE kræver login
                        .anyRequest().authenticated()

                )

                // 🟢 Håndtér API-fejl – men IKKE på frontend-views
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint((req, res, ex) -> {
                            if (req.getRequestURI().startsWith("/api/")) {
                                res.setStatus(401);
                                res.setContentType("application/json");
                                res.getWriter().write("{\"error\":\"unauthorized\"}");
                            } else {
                                // Hvis det er frontend-route (/home fx) → send bare index.html
                                req.getRequestDispatcher("/index.html").forward(req, res);
                            }
                        })
                )

                .authenticationProvider(authenticationProvider())

                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")    // Postman login
                        .permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder.userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder);

        return builder.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}

