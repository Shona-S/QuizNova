package com.quiznova.service;

import com.quiznova.dto.QuestionDTO;
import java.util.List;

public interface QuestionService {
    QuestionDTO createQuestion(QuestionDTO questionDTO);
    List<QuestionDTO> getAllQuestions();
    QuestionDTO getQuestionById(Long id);
    List<QuestionDTO> getQuestionsByQuizTopicId(Long topicId);
    QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO);
    void deleteQuestion(Long id);
}
