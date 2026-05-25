package com.quiznova.service.impl;

import com.quiznova.dto.SubjectDTO;
import com.quiznova.entity.Subject;
import com.quiznova.repository.SubjectRepository;
import com.quiznova.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public SubjectDTO createSubject(SubjectDTO dto) {
        if (subjectRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Subject with name '" + dto.getName() + "' already exists");
        }
        Subject subject = Subject.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        Subject saved = subjectRepository.save(subject);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        return mapToDTO(subject);
    }

    @Override
    public SubjectDTO updateSubject(Long id, SubjectDTO dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        
        if (subjectRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new RuntimeException("Subject with name '" + dto.getName() + "' already exists");
        }

        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        Subject updated = subjectRepository.save(subject);
        return mapToDTO(updated);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        subjectRepository.delete(subject);
    }

    private SubjectDTO mapToDTO(Subject subject) {
        int questionsSum = 0;
        if (subject.getQuizTopics() != null) {
            for (com.quiznova.entity.QuizTopic topic : subject.getQuizTopics()) {
                if (topic.getQuestions() != null) {
                    questionsSum += topic.getQuestions().size();
                }
            }
        }
        return SubjectDTO.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .topicCount(subject.getQuizTopics() != null ? subject.getQuizTopics().size() : 0)
                .questionCount(questionsSum)
                .createdAt(subject.getCreatedAt())
                .build();
    }
}
