package com.quiznova.service;

import com.quiznova.dto.UserResponseDTO;
import java.util.List;

public interface UserManagementService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO blockUser(Long id);
    UserResponseDTO unblockUser(Long id);
    void deleteUser(Long id);
}
