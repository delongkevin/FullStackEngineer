/**
 * Form validation utilities
 */

import { VALIDATION_PATTERNS } from '../config/constants';

export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6; // Simplified for mobile
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const rule = schema[field];
    const value = formData[field];

    if (rule.required && !value) {
      errors[field] = rule.errorMessage;
    } else if (value && rule.validate && !rule.validate(value)) {
      errors[field] = rule.errorMessage;
    }
  });

  return errors;
};

export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || '';
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Common validation schemas
 */
export const loginSchema = {
  email: {
    required: true,
    validate: validateEmail,
    errorMessage: 'Please enter a valid email'
  },
  password: {
    required: true,
    validate: validatePassword,
    errorMessage: 'Password must be at least 6 characters'
  }
};

export const registerSchema = {
  name: {
    required: true,
    validate: validateName,
    errorMessage: 'Name must be 2-50 characters'
  },
  email: {
    required: true,
    validate: validateEmail,
    errorMessage: 'Please enter a valid email'
  },
  password: {
    required: true,
    validate: validatePassword,
    errorMessage: 'Password must be at least 6 characters'
  },
  phone: {
    required: false,
    validate: validatePhone,
    errorMessage: 'Invalid phone format'
  }
};
