package com.quiznova.service.impl;

import com.quiznova.dto.QuizTopicDTO;
import com.quiznova.dto.SubjectDTO;
import com.quiznova.service.QuizTopicService;
import com.quiznova.service.SubjectService;
import com.quiznova.service.UserDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserDashboardServiceImpl implements UserDashboardService {

    private final SubjectService subjectService;
    private final QuizTopicService quizTopicService;

    public UserDashboardServiceImpl(SubjectService subjectService, QuizTopicService quizTopicService) {
        this.subjectService = subjectService;
        this.quizTopicService = quizTopicService;
    }

    @Override
    public List<SubjectDTO> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @Override
    public List<QuizTopicDTO> getQuizzesBySubject(Long subjectId) {
        return quizTopicService.getQuizTopicsBySubjectId(subjectId);
    }
}
