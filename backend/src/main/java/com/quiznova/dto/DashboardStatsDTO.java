package com.quiznova.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalSubjects;
    private Long totalQuizTopics;
    private Long totalQuestions;
    private Long totalUsers;
    private Long totalActiveUsers;
}
