package com.quiznova.service.impl;

import com.quiznova.dto.QuizHistoryDTO;
import com.quiznova.dto.ResultResponseDTO;
import com.quiznova.dto.UserAnswerReviewDTO;
import com.quiznova.dto.UserProfileDTO;
import com.quiznova.dto.ProfileUpdateDTO;
import com.quiznova.entity.QuizAttempt;
import com.quiznova.entity.User;
import com.quiznova.entity.UserAnswer;
import com.quiznova.repository.QuizAttemptRepository;
import com.quiznova.repository.UserAnswerRepository;
import com.quiznova.repository.UserRepository;
import com.quiznova.service.ResultService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ResultServiceImpl implements ResultService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResultServiceImpl(QuizAttemptRepository quizAttemptRepository,
                             UserAnswerRepository userAnswerRepository,
                             UserRepository userRepository,
                             PasswordEncoder passwordEncoder) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userAnswerRepository = userAnswerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResultResponseDTO getResult(Long attemptId, String userEmail) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found with id: " + attemptId));

        if (!attempt.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized: This result does not belong to you.");
        }

        List<UserAnswer> userAnswers = userAnswerRepository.findByQuizAttemptId(attemptId);

        int correctAnswers = 0;
        int wrongAnswers = 0;
        for (UserAnswer ans : userAnswers) {
            if (ans.isCorrect()) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
        }

        List<UserAnswerReviewDTO> detailedReview = userAnswers.stream()
                .map(ans -> UserAnswerReviewDTO.builder()
                        .questionId(ans.getQuestion().getId())
                        .questionTitle(ans.getQuestion().getQuestionTitle())
                        .optionA(ans.getQuestion().getOptionA())
                        .optionB(ans.getQuestion().getOptionB())
                        .optionC(ans.getQuestion().getOptionC())
                        .optionD(ans.getQuestion().getOptionD())
                        .selectedAnswer(ans.getSelectedAnswer())
                        .correctAnswer(ans.getCorrectAnswer())
                        .isCorrect(ans.isCorrect())
                        .marks(ans.getQuestion().getMarks())
                        .build())
                .collect(Collectors.toList());

        return ResultResponseDTO.builder()
                .attemptId(attempt.getId())
                .quizId(attempt.getQuizTopic().getId())
                .quizTitle(attempt.getQuizTopic().getTitle())
                .subjectName(attempt.getQuizTopic().getSubject().getName())
                .score(attempt.getScore())
                .totalMarks(attempt.getTotalMarks())
                .percentage(attempt.getPercentage())
                .totalQuestions(userAnswers.size())
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .submittedAt(attempt.getSubmittedAt())
                .detailedReview(detailedReview)
                .build();
    }

    @Override
    public List<QuizHistoryDTO> getUserHistory(String userEmail) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserEmailOrderBySubmittedAtDesc(userEmail);
        return attempts.stream()
                .map(attempt -> QuizHistoryDTO.builder()
                        .attemptId(attempt.getId())
                        .quizId(attempt.getQuizTopic().getId())
                        .quizTitle(attempt.getQuizTopic().getTitle())
                        .subjectName(attempt.getQuizTopic().getSubject().getName())
                        .score(attempt.getScore())
                        .totalMarks(attempt.getTotalMarks())
                        .percentage(attempt.getPercentage())
                        .submittedAt(attempt.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public UserProfileDTO getUserProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        List<QuizHistoryDTO> fullHistory = getUserHistory(userEmail);
        // limit to top 5 recent attempts for the quick dashboard dropdown
        List<QuizHistoryDTO> recentAttempts = fullHistory.stream()
                .limit(5)
                .collect(Collectors.toList());

        return UserProfileDTO.builder()
                .name(user.getName())
                .email(user.getEmail())
                .joinedDate(user.getCreatedAt())
                .recentAttempts(recentAttempts)
                .build();
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(String currentEmail, ProfileUpdateDTO dto) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + currentEmail));

        // If email is changing, verify it is not already in use
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email '" + dto.getEmail() + "' is already in use by another account.");
            }
            user.setEmail(dto.getEmail());
        }

        user.setName(dto.getName());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);

        return getUserProfile(user.getEmail());
    }
}
