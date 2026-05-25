package com.quiznova.service;

import com.quiznova.dto.SubjectDTO;
import java.util.List;

public interface SubjectService {
    SubjectDTO createSubject(SubjectDTO subjectDTO);
    List<SubjectDTO> getAllSubjects();
    SubjectDTO getSubjectById(Long id);
    SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO);
    void deleteSubject(Long id);
}
