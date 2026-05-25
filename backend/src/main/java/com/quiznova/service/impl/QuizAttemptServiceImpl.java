package com.quiznova.service.impl;

import com.quiznova.dto.QuizAttemptRequestDTO;
import com.quiznova.dto.QuizDetailResponseDTO;
import com.quiznova.dto.QuestionTakeDTO;
import com.quiznova.dto.UserAnswerDTO;
import com.quiznova.entity.*;
import com.quiznova.repository.*;
import com.quiznova.service.QuizAttemptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizTopicRepository quizTopicRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserAnswerRepository userAnswerRepository;

    public QuizAttemptServiceImpl(QuizTopicRepository quizTopicRepository,
                                  UserRepository userRepository,
                                  QuizAttemptRepository quizAttemptRepository,
                                  UserAnswerRepository userAnswerRepository) {
        this.quizTopicRepository = quizTopicRepository;
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.userAnswerRepository = userAnswerRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public QuizDetailResponseDTO getQuizDetails(Long quizId) {
        QuizTopic topic = quizTopicRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        List<QuestionTakeDTO> questionDTOs = topic.getQuestions().stream()
                .map(q -> QuestionTakeDTO.builder()
                        .id(q.getId())
                        .questionTitle(q.getQuestionTitle())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .marks(q.getMarks())
                        .build())
                .collect(Collectors.toList());

        return QuizDetailResponseDTO.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .difficultyLevel(topic.getDifficultyLevel())
                .timeLimit(topic.getTimeLimit())
                .subjectName(topic.getSubject().getName())
                .questions(questionDTOs)
                .build();
    }

    @Override
    public QuizAttempt submitQuiz(String userEmail, QuizAttemptRequestDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        QuizTopic topic = quizTopicRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found: " + request.getQuizId()));

        List<Question> questions = topic.getQuestions();
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("Quiz topic has no questions");
        }

        // Create map of user selected answers by question id
        Map<Long, String> selectedAnswersMap = request.getSelectedAnswers().stream()
                .filter(ans -> ans.getQuestionId() != null)
                .collect(Collectors.toMap(
                        UserAnswerDTO::getQuestionId,
                        ans -> ans.getSelectedAnswer() != null ? ans.getSelectedAnswer().trim() : "",
                        (existing, replacement) -> replacement
                ));

        int score = 0;
        int totalMarks = 0;
        List<UserAnswer> userAnswers = new ArrayList<>();

        // Create QuizAttempt first (without saving yet, we need it to associate with user answers)
        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quizTopic(topic)
                .submittedAt(LocalDateTime.now())
                .build();

        for (Question question : questions) {
            totalMarks += question.getMarks();
            String selected = selectedAnswersMap.getOrDefault(question.getId(), "");
            String correct = question.getCorrectAnswer();
            boolean isCorrect = selected.equalsIgnoreCase(correct);

            if (isCorrect) {
                score += question.getMarks();
            }

            UserAnswer answer = UserAnswer.builder()
                    .quizAttempt(attempt)
                    .question(question)
                    .selectedAnswer(selected)
                    .correctAnswer(correct)
                    .isCorrect(isCorrect)
                    .build();

            userAnswers.add(answer);
        }

        double percentage = totalMarks > 0 ? ((double) score / totalMarks) * 100.0 : 0.0;
        // round percentage to 2 decimal places
        percentage = Math.round(percentage * 100.0) / 100.0;

        attempt.setScore(score);
        attempt.setTotalMarks(totalMarks);
        attempt.setPercentage(percentage);

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        userAnswerRepository.saveAll(userAnswers);

        return savedAttempt;
    }
}
