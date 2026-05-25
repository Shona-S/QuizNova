package com.quiznova.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponseDTO {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private String subjectName;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private LocalDateTime submittedAt;
    private List<UserAnswerReviewDTO> detailedReview;
}
