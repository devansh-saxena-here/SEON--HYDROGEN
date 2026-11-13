import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Email must be 255 characters or less.')
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(72, 'Password must be 72 characters or less.'),
});

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required.')
    .max(80, 'Display name must be 80 characters or less.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Email must be 255 characters or less.')
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(72, 'Password must be 72 characters or less.'),
});

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required.')
    .max(80, 'Display name must be 80 characters or less.'),
  role: z
    .string()
    .trim()
    .min(1, 'Role is required.')
    .max(60, 'Role must be 60 characters or less.'),
  language: z.enum(['English', 'Français', 'Deutsch', 'Español']),
});
