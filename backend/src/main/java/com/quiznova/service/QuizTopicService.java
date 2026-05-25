package com.quiznova.service;

import com.quiznova.dto.QuizTopicDTO;
import java.util.List;

public interface QuizTopicService {
    QuizTopicDTO createQuizTopic(QuizTopicDTO quizTopicDTO);
    List<QuizTopicDTO> getAllQuizTopics();
    QuizTopicDTO getQuizTopicById(Long id);
    List<QuizTopicDTO> getQuizTopicsBySubjectId(Long subjectId);
    QuizTopicDTO updateQuizTopic(Long id, QuizTopicDTO quizTopicDTO);
    void deleteQuizTopic(Long id);
}
