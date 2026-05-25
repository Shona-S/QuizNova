package com.quiznova.service;

import com.quiznova.dto.QuizAttemptRequestDTO;
import com.quiznova.dto.QuizDetailResponseDTO;
import com.quiznova.entity.QuizAttempt;

public interface QuizAttemptService {
    QuizDetailResponseDTO getQuizDetails(Long quizId);
    QuizAttempt submitQuiz(String userEmail, QuizAttemptRequestDTO request);
}
