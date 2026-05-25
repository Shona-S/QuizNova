package com.quiznova.controller;

import com.quiznova.dto.QuizHistoryDTO;
import com.quiznova.dto.UserProfileDTO;
import com.quiznova.dto.ProfileUpdateDTO;
import com.quiznova.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
public class ProfileController {

    private final ResultService resultService;

    public ProfileController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resultService.getUserProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody ProfileUpdateDTO dto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resultService.updateProfile(email, dto));
    }

    @GetMapping("/history")
    public ResponseEntity<List<QuizHistoryDTO>> getUserHistory(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resultService.getUserHistory(email));
    }
}
