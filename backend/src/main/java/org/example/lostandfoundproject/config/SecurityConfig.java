package org.example.lostandfoundproject.config;

import lombok.RequiredArgsConstructor;
import org.example.lostandfoundproject.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors
                        .configurationSource(request -> {
                            var config = new org.springframework.web.cors.CorsConfiguration();
                            config.setAllowedOrigins(List.of("http://localhost:5173"));
                            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                            config.setAllowedHeaders(List.of("Content-Type", "Authorization"));
                            config.setAllowCredentials(true);
                            return config;
                        })
                )
                .csrf(csrf -> csrf.disable())

                .securityContext(context -> context.requireExplicitSave(false))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                .authorizeHttpRequests(req -> req

                        // Static content (kræver dette for SPA modulimport)
                        .requestMatchers("/","/index.html").permitAll()
                        .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                        .requestMatchers("/**/*.js").permitAll()
                        .requestMatchers("/**/*.css").permitAll()
                        .requestMatchers("/favicon.ico").permitAll()

                        // Public API
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lost-items/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lost-items/categories").permitAll()

                        // staff api
                        .requestMatchers(HttpMethod.POST).hasAnyRole("ADMIN", "STAFF")
                        // kun admin og staff kan lave post requests.
                        .requestMatchers(HttpMethod.GET, "/api/lost-items").hasAnyRole("ADMIN", "STAFF")

                        // only admin

                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())

                // fordi man ikke bare kan fange en exception i globaladvice, det sker nemlig før at controlleren bliver ramt.
                // den her smider den videre til globaladvice.
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> {
                            res.setStatus(401);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\": \"Unauthorized\"}");
                        })
                )

                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

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
}
