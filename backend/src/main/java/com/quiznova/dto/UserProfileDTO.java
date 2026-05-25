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
public class UserProfileDTO {
    private String name;
    private String email;
    private LocalDateTime joinedDate;
    private List<QuizHistoryDTO> recentAttempts;
}
