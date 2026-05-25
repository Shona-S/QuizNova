package com.quiznova.controller;

import com.quiznova.dto.UserResponseDTO;
import com.quiznova.service.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> list = userManagementService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/block/{id}")
    public ResponseEntity<UserResponseDTO> blockUser(@PathVariable Long id) {
        UserResponseDTO blocked = userManagementService.blockUser(id);
        return ResponseEntity.ok(blocked);
    }

    @PutMapping("/unblock/{id}")
    public ResponseEntity<UserResponseDTO> unblockUser(@PathVariable Long id) {
        UserResponseDTO unblocked = userManagementService.unblockUser(id);
        return ResponseEntity.ok(unblocked);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userManagementService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
