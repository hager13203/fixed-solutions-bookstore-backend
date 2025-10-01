const Ajv = require("ajv");
const ajvErrors = require("ajv-errors");
const ajvFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true }); 
ajvErrors(ajv);
ajvFormats(ajv);

// Create Book Schema
const createBookSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 3,
      errorMessage: "Title must be at least 3 characters long",
    },
    description: {
      type: "string",
      minLength: 5,
      errorMessage: "Description must be at least 5 characters long",
    },
    amount: {
      type: "integer",
      minimum: 0,
      description: "Amount must be a non-negative integer",
    },
  },
  required: ["title", "description"],
  additionalProperties: false,
  errorMessage: {
    required: {
      title: "Title is required",
      description: "Description is required",
      amount: "Amount is required",
    },
    additionalProperties: "Extra fields are not allowed",
  },
};

// Update Book Schema (partial)
const updateBookSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 3,
      errorMessage: "Title must be at least 3 characters long",
    },
    description: {
      type: "string",
      minLength: 5,
      errorMessage: "Description must be at least 5 characters long",
    },
    amount: {
      type: "integer",
      minimum: 0,
      description: "Amount must be a non-negative integer",
    },
  },
  errorMessage: {
    additionalProperties: "Extra fields are not allowed",
  },
};

module.exports = {
  validateCreateBook: ajv.compile(createBookSchema),
  validateUpdateBook: ajv.compile(updateBookSchema),
};
