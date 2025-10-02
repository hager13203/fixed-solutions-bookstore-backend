const Ajv = require("ajv");
const ajvErrors = require("ajv-errors");
const ajvFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true }); 
ajvErrors(ajv);
ajvFormats(ajv);

// Create User Schema (all required)
const createUserSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      errorMessage: "Name must be at least 3 characters long",
    },
    email: {
      type: "string",
      format: "email",
      errorMessage: "Email must be a valid email address",
    },
    password: {
      type: "string",
      minLength: 6,
      errorMessage: "Password must be at least 6 characters long",
    },
    age: {
      type: "integer",
      minimum: 0,
      errorMessage: "Age must be a positive number",
    },
    role: {
      type: "string",
      enum: ["user", "admin"],
      errorMessage: "Role must be either 'user' or 'admin'",
    },
  },
  required: ["name", "email", "password", "age","role"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "Name is required",
      email: "Email is required",
      password: "Password is required",
      role: "Role is required",
    },
    additionalProperties: "Extra fields are not allowed",
  },
};

// Update User Schema (no required fields)
const updateUserSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      errorMessage: "Name must be at least 2 characters long",
    },
    email: {
      type: "string",
      format: "email",
      errorMessage: "Email must be a valid email address",
    },
    password: {
      type: "string",
      minLength: 6,
      errorMessage: "Password must be at least 6 characters long",
    },
    age: {
      type: "integer",
      minimum: 0,
      errorMessage: "Age must be a positive number",
    },
    role: {
      type: "string",
      enum: ["user", "admin"],
      errorMessage: "Role must be either 'user' or 'admin'",
    },
  },
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "Extra fields are not allowed",
  },
};

module.exports = {
  validateCreateUser: ajv.compile(createUserSchema),
  validateUpdateUser: ajv.compile(updateUserSchema),
};
