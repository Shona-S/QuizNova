package com.quiznova.controller;

import com.quiznova.dto.QuizTopicDTO;
import com.quiznova.dto.SubjectDTO;
import com.quiznova.service.UserDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/subjects")
@PreAuthorize("hasRole('USER')")
public class UserDashboardController {

    private final UserDashboardService userDashboardService;

    public UserDashboardController(UserDashboardService userDashboardService) {
        this.userDashboardService = userDashboardService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        return ResponseEntity.ok(userDashboardService.getAllSubjects());
    }

    @GetMapping("/{subjectId}/quizzes")
    public ResponseEntity<List<QuizTopicDTO>> getQuizzesBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(userDashboardService.getQuizzesBySubject(subjectId));
    }
}
