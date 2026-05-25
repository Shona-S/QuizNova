package com.quiznova.controller;

import com.quiznova.dto.QuizTopicDTO;
import com.quiznova.service.QuizTopicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/topics")
@PreAuthorize("hasRole('ADMIN')")
public class QuizTopicController {

    private final QuizTopicService quizTopicService;

    public QuizTopicController(QuizTopicService quizTopicService) {
        this.quizTopicService = quizTopicService;
    }

    @PostMapping
    public ResponseEntity<QuizTopicDTO> createQuizTopic(@Valid @RequestBody QuizTopicDTO dto) {
        QuizTopicDTO created = quizTopicService.createQuizTopic(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<QuizTopicDTO>> getAllQuizTopics() {
        List<QuizTopicDTO> list = quizTopicService.getAllQuizTopics();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizTopicDTO> getQuizTopicById(@PathVariable Long id) {
        QuizTopicDTO dto = quizTopicService.getQuizTopicById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<QuizTopicDTO>> getQuizTopicsBySubjectId(@PathVariable Long subjectId) {
        List<QuizTopicDTO> list = quizTopicService.getQuizTopicsBySubjectId(subjectId);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizTopicDTO> updateQuizTopic(@PathVariable Long id, @Valid @RequestBody QuizTopicDTO dto) {
        QuizTopicDTO updated = quizTopicService.updateQuizTopic(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuizTopic(@PathVariable Long id) {
        quizTopicService.deleteQuizTopic(id);
        return ResponseEntity.noContent().build();
    }
}
