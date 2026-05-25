package com.quiznova.controller;

import com.quiznova.dto.DashboardStatsDTO;
import com.quiznova.repository.QuestionRepository;
import com.quiznova.repository.QuizTopicRepository;
import com.quiznova.repository.SubjectRepository;
import com.quiznova.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final SubjectRepository subjectRepository;
    private final QuizTopicRepository quizTopicRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public AdminDashboardController(
            SubjectRepository subjectRepository,
            QuizTopicRepository quizTopicRepository,
            QuestionRepository questionRepository,
            UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.quizTopicRepository = quizTopicRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        long totalSubjects = subjectRepository.count();
        long totalQuizTopics = quizTopicRepository.count();
        long totalQuestions = questionRepository.count();
        long totalUsers = userRepository.countByRole("ROLE_USER");
        long totalActiveUsers = userRepository.countByRoleAndBlocked("ROLE_USER", false);

        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalSubjects(totalSubjects)
                .totalQuizTopics(totalQuizTopics)
                .totalQuestions(totalQuestions)
                .totalUsers(totalUsers)
                .totalActiveUsers(totalActiveUsers)
                .build();

        return ResponseEntity.ok(stats);
    }
}
