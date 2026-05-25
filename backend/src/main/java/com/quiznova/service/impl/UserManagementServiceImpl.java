package com.quiznova.service.impl;

import com.quiznova.dto.UserResponseDTO;
import com.quiznova.entity.User;
import com.quiznova.repository.UserRepository;
import com.quiznova.service.UserManagementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;

    public UserManagementServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> "ROLE_USER".equals(user.getRole()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if ("ROLE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Admin accounts cannot be blocked");
        }
        user.setBlocked(true);
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    @Override
    public UserResponseDTO unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBlocked(false);
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if ("ROLE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Admin accounts cannot be deleted");
        }
        userRepository.delete(user);
    }

    private UserResponseDTO mapToDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .blocked(user.isBlocked())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
