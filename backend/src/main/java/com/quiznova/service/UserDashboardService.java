package com.quiznova.service;

import com.quiznova.dto.QuizTopicDTO;
import com.quiznova.dto.SubjectDTO;

import java.util.List;

public interface UserDashboardService {
    List<SubjectDTO> getAllSubjects();
    List<QuizTopicDTO> getQuizzesBySubject(Long subjectId);
}
