package com.quiznova.service;

import com.quiznova.dto.QuizHistoryDTO;
import com.quiznova.dto.ResultResponseDTO;
import com.quiznova.dto.UserProfileDTO;
import com.quiznova.dto.ProfileUpdateDTO;

import java.util.List;

public interface ResultService {
    ResultResponseDTO getResult(Long attemptId, String userEmail);
    List<QuizHistoryDTO> getUserHistory(String userEmail);
    UserProfileDTO getUserProfile(String userEmail);
    UserProfileDTO updateProfile(String currentEmail, ProfileUpdateDTO dto);
}
