package com.quiznova.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDetailResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String difficultyLevel;
    private Integer timeLimit;
    private String subjectName;
    private List<QuestionTakeDTO> questions;
}
