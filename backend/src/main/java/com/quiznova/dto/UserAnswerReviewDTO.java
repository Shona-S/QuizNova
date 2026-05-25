package com.quiznova.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAnswerReviewDTO {
    private Long questionId;
    private String questionTitle;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String selectedAnswer;
    private String correctAnswer;
    
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    
    private Integer marks;
}
