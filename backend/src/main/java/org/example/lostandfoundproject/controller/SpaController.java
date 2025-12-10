package org.example.lostandfoundproject.controller;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward(HttpServletRequest request) {
        String uri = request.getRequestURI();

        if (uri.startsWith("/api")) return null; // API skal ikke forwardes

        return "forward:/index.html"; // send alt til SPA
    }
}
