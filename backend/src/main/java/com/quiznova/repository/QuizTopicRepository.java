package com.quiznova.repository;

import com.quiznova.entity.QuizTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizTopicRepository extends JpaRepository<QuizTopic, Long> {
    List<QuizTopic> findBySubjectId(Long subjectId);
}
