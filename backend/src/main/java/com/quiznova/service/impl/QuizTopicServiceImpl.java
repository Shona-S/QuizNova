package com.quiznova.service.impl;

import com.quiznova.dto.QuizTopicDTO;
import com.quiznova.entity.QuizTopic;
import com.quiznova.entity.Subject;
import com.quiznova.repository.QuizTopicRepository;
import com.quiznova.repository.SubjectRepository;
import com.quiznova.service.QuizTopicService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizTopicServiceImpl implements QuizTopicService {

    private final QuizTopicRepository quizTopicRepository;
    private final SubjectRepository subjectRepository;

    public QuizTopicServiceImpl(QuizTopicRepository quizTopicRepository, SubjectRepository subjectRepository) {
        this.quizTopicRepository = quizTopicRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public QuizTopicDTO createQuizTopic(QuizTopicDTO dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + dto.getSubjectId()));

        QuizTopic topic = QuizTopic.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .difficultyLevel(dto.getDifficultyLevel())
                .timeLimit(dto.getTimeLimit())
                .subject(subject)
                .build();

        QuizTopic saved = quizTopicRepository.save(topic);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizTopicDTO> getAllQuizTopics() {
        return quizTopicRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuizTopicDTO getQuizTopicById(Long id) {
        QuizTopic topic = quizTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz Topic not found with id: " + id));
        return mapToDTO(topic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizTopicDTO> getQuizTopicsBySubjectId(Long subjectId) {
        return quizTopicRepository.findBySubjectId(subjectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizTopicDTO updateQuizTopic(Long id, QuizTopicDTO dto) {
        QuizTopic topic = quizTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz Topic not found with id: " + id));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + dto.getSubjectId()));

        topic.setTitle(dto.getTitle());
        topic.setDescription(dto.getDescription());
        topic.setDifficultyLevel(dto.getDifficultyLevel());
        topic.setTimeLimit(dto.getTimeLimit());
        topic.setSubject(subject);

        QuizTopic updated = quizTopicRepository.save(topic);
        return mapToDTO(updated);
    }

    @Override
    public void deleteQuizTopic(Long id) {
        QuizTopic topic = quizTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz Topic not found with id: " + id));
        quizTopicRepository.delete(topic);
    }

    private QuizTopicDTO mapToDTO(QuizTopic topic) {
        return QuizTopicDTO.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .difficultyLevel(topic.getDifficultyLevel())
                .timeLimit(topic.getTimeLimit())
                .subjectId(topic.getSubject().getId())
                .subjectName(topic.getSubject().getName())
                .questionCount(topic.getQuestions() != null ? topic.getQuestions().size() : 0)
                .createdAt(topic.getCreatedAt())
                .build();
    }
}
