package com.quiznova.controller;

import com.quiznova.dto.QuizAttemptRequestDTO;
import com.quiznova.dto.QuizDetailResponseDTO;
import com.quiznova.entity.QuizAttempt;
import com.quiznova.service.QuizAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/quiz")
@PreAuthorize("hasRole('USER')")
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    public QuizAttemptController(QuizAttemptService quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDetailResponseDTO> getQuizDetails(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.getQuizDetails(quizId));
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody QuizAttemptRequestDTO request, Authentication authentication) {
        String email = authentication.getName();
        QuizAttempt attempt = quizAttemptService.submitQuiz(email, request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quiz submitted successfully");
        response.put("attemptId", attempt.getId());
        response.put("score", attempt.getScore());
        response.put("totalMarks", attempt.getTotalMarks());
        response.put("percentage", attempt.getPercentage());

        return ResponseEntity.ok(response);
    }
}
