package com.quiznova.service;

import com.quiznova.dto.AuthResponse;
import com.quiznova.dto.LoginRequest;
import com.quiznova.dto.RegisterRequest;
import com.quiznova.entity.User;

public interface AuthService {
    User registerUser(RegisterRequest request);
    User registerAdmin(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getCurrentUser(String email);
}
