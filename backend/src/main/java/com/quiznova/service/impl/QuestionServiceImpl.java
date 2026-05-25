package com.quiznova.service.impl;

import com.quiznova.dto.QuestionDTO;
import com.quiznova.entity.Question;
import com.quiznova.entity.QuizTopic;
import com.quiznova.repository.QuestionRepository;
import com.quiznova.repository.QuizTopicRepository;
import com.quiznova.service.QuestionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizTopicRepository quizTopicRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository, QuizTopicRepository quizTopicRepository) {
        this.questionRepository = questionRepository;
        this.quizTopicRepository = quizTopicRepository;
    }

    @Override
    public QuestionDTO createQuestion(QuestionDTO dto) {
        QuizTopic topic = quizTopicRepository.findById(dto.getQuizTopicId())
                .orElseThrow(() -> new RuntimeException("Quiz Topic not found with id: " + dto.getQuizTopicId()));

        Question question = Question.builder()
                .questionTitle(dto.getQuestionTitle())
                .optionA(dto.getOptionA())
                .optionB(dto.getOptionB())
                .optionC(dto.getOptionC())
                .optionD(dto.getOptionD())
                .correctAnswer(dto.getCorrectAnswer())
                .marks(dto.getMarks())
                .quizTopic(topic)
                .build();

        Question saved = questionRepository.save(question);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        return mapToDTO(question);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionDTO> getQuestionsByQuizTopicId(Long topicId) {
        return questionRepository.findByQuizTopicId(topicId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionDTO updateQuestion(Long id, QuestionDTO dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        QuizTopic topic = quizTopicRepository.findById(dto.getQuizTopicId())
                .orElseThrow(() -> new RuntimeException("Quiz Topic not found with id: " + dto.getQuizTopicId()));

        question.setQuestionTitle(dto.getQuestionTitle());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setMarks(dto.getMarks());
        question.setQuizTopic(topic);

        Question updated = questionRepository.save(question);
        return mapToDTO(updated);
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        questionRepository.delete(question);
    }

    private QuestionDTO mapToDTO(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .questionTitle(question.getQuestionTitle())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(question.getCorrectAnswer())
                .marks(question.getMarks())
                .quizTopicId(question.getQuizTopic().getId())
                .quizTopicTitle(question.getQuizTopic().getTitle())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
