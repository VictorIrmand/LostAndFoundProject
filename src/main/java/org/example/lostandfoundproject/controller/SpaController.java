package org.example.lostandfoundproject.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/home",
            "/homepage",
            "/login",
    })
    public String forward(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Hvis det ligner en fil (.js, .css, .png osv.) eller starter med /api — lad Spring selv tage den
        if (path.contains(".") || path.startsWith("/api")) {
            return null;
        }

        // Alt andet (SPA routes) sendes til index.html
        return "forward:/index.html";
    }
}
