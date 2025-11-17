/**
 * Authentication Controller - Handles user authentication requests
 * Implements authentication operations from class diagram
 * 
 * Maps to User class methods:
 * - authenticate(): Validates user credentials and issues JWT token
 * - Changepassword(): Allows users to update their password
 */

import { Request, Response } from 'express';

import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { authService } from './auth.service';

/**
 * 🔐 IMPORTANT: User Login/Authentication
 * Implements User.authenticate() from class diagram
 * 
 * @route POST /api/auth/login
 * @access Public
 * @returns JWT token and user data
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(ApiResponse.success(200, 'Login successful', result));
});

/**
 * 📝 IMPORTANT: User Registration
 * Creates new user account (Buyer or Consultant)
 * 
 * @route POST /api/auth/register
 * @access Public
 * @returns JWT token and newly created user data
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json(ApiResponse.success(201, 'Registration successful', result));
});



