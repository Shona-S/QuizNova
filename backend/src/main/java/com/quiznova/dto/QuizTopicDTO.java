package com.quiznova.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizTopicDTO {
    private Long id;
    private String title;
    private String description;
    private String difficultyLevel;
    private Integer timeLimit;
    private Long subjectId;
    private String subjectName;
    private Integer questionCount;
    private LocalDateTime createdAt;
}
