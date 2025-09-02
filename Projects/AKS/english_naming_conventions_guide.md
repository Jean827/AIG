# English Naming Conventions Guide

## 1. Purpose

This document establishes standard naming conventions for the AKS (Administrative Knowledge System) project. Consistent naming conventions help improve code readability, maintainability, and collaboration among team members. All code, comments, folders, and file names should adhere to these English naming conventions.

## 2. General Principles

- Use descriptive and meaningful names that reflect the purpose or function
- Keep names concise but not cryptic
- Use English language for all naming (no Chinese characters)
- Maintain consistency throughout the project
- Follow industry-standard naming conventions for the specific programming language

## 3. Code Naming Conventions

### 3.1 Variables

- **Camel Case**: Use camelCase for variable names (first letter lowercase, subsequent words capitalized)
- **Descriptive**: Variable names should clearly indicate their purpose
- **Avoid Abbreviations**: Use full words unless the abbreviation is widely accepted
- **Examples**:
  ```javascript
  // Good
  let userName = "John Doe";
  let totalAmount = 1000;
  let isLoggedIn = false;
  
  // Bad
  let un = "John Doe"; // Undescriptive abbreviation
  let tamt = 1000; // Undescriptive abbreviation
  let log = false; // Ambiguous
  ```

### 3.2 Functions/Methods

- **Camel Case**: Use camelCase for function/method names
- **Verb-Noun Structure**: Start with a verb followed by a noun to indicate action
- **Descriptive**: Clearly indicate what the function does
- **Examples**:
  ```javascript
  // Good
  function calculateTotalAmount() { ... }
  function saveUserInformation(userData) { ... }
  function validateEmailAddress(email) { ... }
  
  // Bad
  function calc() { ... } // Undescriptive
  function data() { ... } // Ambiguous
  function doStuff() { ... } // Vague
  ```

### 3.3 Classes

- **Pascal Case**: Use PascalCase for class names (first letter of each word capitalized)
- **Noun or Noun Phrase**: Class names should be nouns or noun phrases
- **Descriptive**: Clearly indicate the class's purpose
- **Examples**:
  ```javascript
  // Good
  class UserController { ... }
  class DatabaseConnection { ... }
  class AuthenticationService { ... }
  
  // Bad
  class usercontroller { ... } // Incorrect casing
  class DBConn { ... } // Undescriptive abbreviation
  class Handler { ... } // Too generic
  ```

### 3.4 Constants

- **Uppercase with Underscores**: Use UPPERCASE_WITH_UNDERSCORES for constants
- **Descriptive**: Clearly indicate the constant's purpose
- **Examples**:
  ```javascript
  // Good
  const MAX_USERS = 100;
  const API_BASE_URL = "https://api.example.com";
  const DEFAULT_TIMEOUT = 30000;
  
  // Bad
  const max_users = 100; // Incorrect casing
  const url = "https://api.example.com"; // Not using uppercase
  const dt = 30000; // Undescriptive abbreviation
  ```

### 3.5 Interfaces

- **Pascal Case**: Use PascalCase for interface names
- **Prefix with "I"**: Prefix interface names with "I" to distinguish them from classes
- **Descriptive**: Clearly indicate the interface's purpose
- **Examples**:
  ```typescript
  // Good
  interface IUserRepository {
    getUserById(id: string): User | null;
    saveUser(user: User): void;
  }
  
  interface ILogger {
    log(message: string): void;
    error(error: Error): void;
  }
  
  // Bad
  interface userRepository { ... } // Incorrect casing
  interface Logging { ... } // No "I" prefix
  ```

### 3.6 Type Aliases

- **Pascal Case**: Use PascalCase for type aliases
- **Descriptive**: Clearly indicate the type's purpose
- **Examples**:
  ```typescript
  // Good
  type UserId = string;
  type ApiResponse<T> = { data: T; status: number };
  
  // Bad
  type userid = string; // Incorrect casing
  type resp<T> = { data: T; status: number }; // Undescriptive
  ```

### 3.7 Enums

- **Pascal Case**: Use PascalCase for enum names
- **Pascal Case for Enum Values**: Use PascalCase for enum values
- **Descriptive**: Clearly indicate the enum's purpose and values
- **Examples**:
  ```typescript
  // Good
  enum UserRole {
    Admin,
    User,
    Guest
  }
  
  enum HttpStatusCode {
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalServerError = 500
  }
  
  // Bad
  enum user_role { ... } // Incorrect casing
  enum Status { ok, bad, not_found } // Inconsistent value casing
  ```

## 4. File and Folder Naming Conventions

### 4.1 File Names

- **Lowercase with Hyphens**: Use kebab-case (lowercase words separated by hyphens) for most files
- **Consistency with Framework**: Follow framework-specific conventions when applicable
- **Descriptive**: Clearly indicate the file's purpose or contents
- **Examples**:
  ```
  // Good
  user-profile.js
  data-processing.py
  authentication.service.ts
  app.component.html
  
  // Bad
  UserProfile.js // PascalCase for files
  dataproc.js // No separation between words
  auth.js // Undescriptive
  ```

### 4.2 Component Files (React/Vue)

- **Pascal Case**: Use PascalCase for component files in React and Vue projects
- **Consistent with Component Name**: File name should match the component name
- **Examples**:
  ```
  // Good
  UserProfile.jsx
  Dashboard.vue
  DataTable.tsx
  
  // Bad
  user-profile.jsx // Kebab-case for component files
  dashboard-component.jsx // Redundant suffix
  ```

### 4.3 Folder Names

- **Lowercase with Hyphens**: Use kebab-case for folder names
- **Plural for Collections**: Use plural names for folders containing multiple related items
- **Descriptive**: Clearly indicate the folder's contents
- **Examples**:
  ```
  // Good
  user-management/
  data-processing/
  components/
  services/
  utils/
  
  // Bad
  UserManagement/ // PascalCase for folders
  data/ // Too generic
  misc/ // Undescriptive
  ```

### 4.4 Test Files

- **Suffix with ".test" or ".spec"**: Add a ".test" or ".spec" suffix to test files
- **Match Source File Name**: Test file name should match the source file being tested
- **Examples**:
  ```
  // Good
  user-profile.test.js
  authentication.service.spec.ts
  
  // Bad
  test-user.js // Different naming pattern
  auth-test.js // Doesn't match source file name
  ```

## 5. Database Naming Conventions

### 5.1 Database Names

- **Lowercase with Underscores**: Use lowercase_with_underscores for database names
- **Descriptive**: Clearly indicate the database's purpose
- **Examples**:
  ```
  // Good
  aks_db
  user_management_system
  
  // Bad
  AKSDatabase // Mixed case
  ums // Undescriptive abbreviation
  ```

### 5.2 Table Names

- **Lowercase with Underscores**: Use lowercase_with_underscores for table names
- **Plural**: Use plural nouns for table names
- **Descriptive**: Clearly indicate the table's contents
- **Examples**:
  ```sql
  -- Good
  users
  user_profiles
  authentication_logs
  
  -- Bad
  User // Singular and mixed case
  tblUsers // Prefix and mixed case
  usr // Undescriptive abbreviation
  ```

### 5.3 Column Names

- **Lowercase with Underscores**: Use lowercase_with_underscores for column names
- **Descriptive**: Clearly indicate the column's purpose
- **Consistent Data Types**: Use consistent naming for columns with similar data types
- **Examples**:
  ```sql
  -- Good
  user_id
  first_name
  email_address
  created_at
  updated_at
  
  -- Bad
  UserID // Mixed case
  fName // Undescriptive abbreviation
  email // Inconsistent with other address columns
  ```

### 5.4 Indexes and Constraints

- **Descriptive Prefixes**: Use descriptive prefixes for indexes and constraints
- **Lowercase with Underscores**: Use lowercase_with_underscores
- **Examples**:
  ```sql
  -- Good
  idx_users_email
  fk_users_roles
  pk_users
  
  -- Bad
  Index1 // Undescriptive
  FKUserRole // Mixed case
  ```

## 6. API and Endpoint Naming Conventions

### 6.1 API Routes

- **Lowercase with Hyphens**: Use kebab-case for API routes
- **Resource-Based**: Use nouns to represent resources
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE) to indicate action
- **Examples**:
  ```
  // Good
  GET /users
  GET /users/:id
  POST /users
  PUT /users/:id
  DELETE /users/:id
  GET /users/:id/profile
  
  // Bad
  GET /getUsers // Verb in route
  GET /USER/:id // Mixed case
  POST /CreateUser // Verb and mixed case
  ```

### 6.2 Query Parameters

- **Camel Case**: Use camelCase for query parameters
- **Descriptive**: Clearly indicate the parameter's purpose
- **Examples**:
  ```
  // Good
  GET /users?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
  
  // Bad
  GET /users?PAGE=1&page_size=10 // Inconsistent casing
  GET /users?p=1&s=createdAt // Undescriptive abbreviations
  ```

## 7. Documentation Naming Conventions

### 7.1 Document Titles

- **Title Case**: Use Title Case for document titles (first letter of each major word capitalized)
- **Descriptive**: Clearly indicate the document's purpose
- **Examples**:
  ```
  // Good
  Project Management Plan
  User Interface Design Guidelines
  API Documentation
  
  // Bad
  project management plan // All lowercase
  UI guidelines // Abbreviation without explanation
  ```

### 7.2 Section Headings

- **Title Case**: Use Title Case for section headings
- **Hierarchical**: Use hierarchical numbering for section headings
- **Examples**:
  ```markdown
  ## 2. Project Objectives
  ### 2.1 Primary Objectives
  #### 2.1.1 User Management
  ```

### 7.3 Code Comments

- **English Language**: All comments should be written in English
- **Clear and Concise**: Comments should be clear, concise, and add value
- **Avoid Redundancy**: Do not comment on obvious code
- **Examples**:
  ```javascript
  // Good
  // Calculate total amount including tax
  function calculateTotal(amount, taxRate) {
    return amount * (1 + taxRate);
  }
  
  // Bad
  // This function adds 1 to the tax rate and multiplies by amount // Redundant
  function calculateTotal(amount, taxRate) {
    return amount * (1 + taxRate); // Multiply amount by (1 + taxRate)
  }
  ```

## 8. Commit Message Conventions

- **English Language**: All commit messages should be written in English
- **Imperative Mood**: Use imperative mood in commit messages (e.g., "Add feature" not "Added feature")
- **Short and Descriptive**: First line should be a short summary (50 characters or less)
- **Detailed Description**: Provide a more detailed description in the body if necessary
- **Examples**:
  ```
  // Good
  Add user authentication feature
  
  Implement JWT-based authentication for API endpoints.
  Includes user login, registration, and token validation.
  
  // Bad
  fixed bug // Undescriptive
  Added some code // Vague
  I made changes to the authentication // First person and vague
  ```

## 9. Exceptions and Special Cases

- **Legacy Code**: When working with legacy code, follow existing conventions for consistency
- **Third-Party Libraries**: Adhere to naming conventions of third-party libraries when extending them
- **Framework-Specific Conventions**: Follow framework-specific naming conventions when they differ from this guide

## 10. Enforcement

- **Code Reviews**: Naming conventions should be checked during code reviews
- **Linters**: Configure linters to enforce naming conventions
- **Documentation**: Refer to this guide when creating new files or code
- **Training**: Ensure all team members are trained on these conventions

By following these naming conventions, we can ensure consistency, readability, and maintainability throughout the AKS project, making it easier for team members to collaborate and understand the codebase.