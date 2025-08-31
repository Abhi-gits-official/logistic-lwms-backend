package com.cts.lwms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/thymeleaf/admin/login";
    }

    @GetMapping("/admin")
    public String admin() {
        return "redirect:/thymeleaf/admin/login";
    }
} 