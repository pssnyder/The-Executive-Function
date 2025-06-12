# Testing Guide: The Executive Function

## 1. Introduction

Welcome to the testing guide for "The Executive Function" application! This guide provides step-by-step instructions to test the core functionalities of the app. The Executive Function is designed to help users manage tasks, leveraging AI to understand natural language inputs for task creation and organization.

Your feedback during testing is invaluable for improving the application.

## 2. Prerequisites

*   **Browser**: A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
*   **API Key (Optional for basic testing, Required for full AI functionality)**:
    *   For the AI-powered task parsing to work with the actual Gemini API, you need to have a `process.env.API_KEY` environment variable correctly set up in your local development environment where the application is served.
    *   If the API key is **not** set or is invalid, the application will use a **mock parsing service**. This allows you to test the UI flow, but the task details (title, description, priority, etc.) will be pre-filled mock data rather than intelligently parsed from your input. The mock response will usually indicate that it's a mock (e.g., "Mock Parsed: ...").
*   **Application Running**: Ensure the application is built and running locally.

## 3. Testing Scenarios

Follow the steps for each scenario and verify the expected results.

### 3.1. User Authentication

**Scenario 3.1.1: User Registration**

*   **Objective**: Verify a new user can register.
*   **Steps**:
    1.  Open the application. You should see the login/registration form.
    2.  Click on the "Need an account? Sign Up" link.
    3.  Enter a new email address (e.g., `testuser` + `[random_number]` + `@example.com`) in the "Email address" field.
    4.  Enter a password in the "Password" field (optional for demo, but good to test).
    5.  Click the "Sign Up" button.
*   **Expected Result**:
    *   The user is redirected to the main dashboard.
    *   A welcome message like "Hello, [your_email]!" is displayed.
    *   The "Logout" button is visible in the header.

**Scenario 3.1.2: User Login**

*   **Objective**: Verify an existing user can log in.
*   **Steps**:
    1.  Ensure you have registered a user (from Scenario 3.1.1) or use the mock email `user@example.com`.
    2.  If logged in, click "Logout".
    3.  On the login form, enter the registered email address.
    4.  Enter the corresponding password (if set during registration).
    5.  Click the "Sign In" button.
*   **Expected Result**:
    *   The user is redirected to the main dashboard.
    *   A welcome message with the user's email is displayed.
    *   The "Logout" button is visible in the header.

**Scenario 3.1.3: User Logout**

*   **Objective**: Verify a logged-in user can log out.
*   **Steps**:
    1.  Log in to the application.
    2.  Click the "Logout" button in the header.
*   **Expected Result**:
    *   The user is redirected to the login/registration form.
    *   The dashboard is no longer visible.

**Scenario 3.1.4: Attempting Login with Non-Existent User (Demo Behavior)**
*   **Objective**: Verify the demo behavior for login with a non-existent email.
*   **Steps**:
    1. If logged in, logout.
    2. On the login form, enter a completely new email address not previously registered (e.g., `newloginattempt@example.com`).
    3. Enter any password (or leave blank).
    4. Click "Sign In".
*   **Expected Result**:
    *   Due to the current demo setup in `AuthContext.tsx`, this might register and log in the new user.
    *   The user is redirected to the dashboard. This behavior is specific to the current simplified auth logic.

### 3.2. AI-Powered Task Creation

**Scenario 3.2.1: Add Task with Full Natural Language Input**

*   **Objective**: Verify tasks can be created using natural language and AI parsing.
*   **Steps**:
    1.  Log in to the application.
    2.  In the "Add New Task with AI" section, type a detailed task description into the input field. For example: `"Schedule a project review meeting with the team for next Wednesday at 2 PM, urgent priority, under the 'Work' category. Discuss Q3 roadmap."`
    3.  Click the "Parse with AI" button.
    4.  Observe the "AI Suggested Details" section that appears below.
    5.  Verify the extracted details (Title, Description, Priority, Due Date, Category).
        *   _If API key is configured_: The details should be intelligently parsed. "next Wednesday" should be a calculated date.
        *   _If API key is NOT configured_: The details will be mock data.
    6.  Click the "Add Task" button (the green one that appears after parsing).
*   **Expected Result**:
    *   The AI suggestion section shows fields populated based on your input (or mock data).
    *   The "Title" should be something like "Schedule project review meeting".
    *   "Description" might contain "Discuss Q3 roadmap".
    *   "Priority" should be "urgent".
    *   "Due Date" should be the date of the upcoming Wednesday.
    *   "Category" should be "Work".
    *   After clicking "Add Task", the input field clears, the AI suggestion section disappears.
    *   The new task appears in the "Task List" below, reflecting the (potentially modified) parsed details.

**Scenario 3.2.2: Add Task with Partial/Ambiguous Natural Language Input**

*   **Objective**: Verify AI parsing handles less specific input and applies defaults.
*   **Steps**:
    1.  Log in.
    2.  In the task input field, type: `"Buy groceries this evening"`
    3.  Click "Parse with AI".
    4.  Observe the "AI Suggested Details".
    5.  Click "Add Task".
*   **Expected Result**:
    *   "Title" should be "Buy groceries".
    *   "Due Date" might be today's date (if "this evening" is parsed) or remain blank.
    *   "Priority" should default to "medium" (or as parsed).
    *   "Category" might default to "Personal" or "General".
    *   Task is added to the list.

**Scenario 3.2.3: Modify AI Suggestions Before Adding**

*   **Objective**: Verify that AI-suggested details can be manually edited before adding the task.
*   **Steps**:
    1.  Log in.
    2.  Enter a natural language task: `"Plan weekend trip, low priority"`
    3.  Click "Parse with AI".
    4.  In the "AI Suggested Details" section:
        *   Change the "Title" to "Plan extended weekend trip".
        *   Change the "Priority" from "low" to "high" using the dropdown.
        *   Set a "Due Date" using the date picker.
        *   Change "Category" to "Travel".
    5.  Click "Add Task".
*   **Expected Result**:
    *   The task is added to the list with your manually overridden details, not the original AI suggestions.

**Scenario 3.2.4: Clear AI Suggestion**
*   **Objective**: Verify the "Clear AI Suggestion" button works.
*   **Steps**:
    1. Log in.
    2. Enter a natural language task: `"Draft email to client"`
    3. Click "Parse with AI".
    4. The "AI Suggested Details" section appears.
    5. Click the "Clear AI Suggestion" button.
*   **Expected Result**:
    *   The "AI Suggested Details" section disappears.
    *   The original natural language input remains in the main input field.
    *   The green "Add Task" button (that appeared after parsing) should disappear or become disabled, as there are no longer parsed details to add directly.

**Scenario 3.2.5: Attempt to Add Task with Empty Input**
*   **Objective**: Verify behavior when trying to parse or add with no input.
*   **Steps**:
    1. Log in.
    2. Ensure the natural language input field is empty.
    3. Click "Parse with AI".
*   **Expected Result**:
    *   An error message like "Please enter a task description." should appear.
    *   No parsing attempt should be made.
    *   The "AI Suggested Details" section should not appear.

### 3.3. Task Display and Manual Management

**Scenario 3.3.1: View Task List**

*   **Objective**: Verify tasks are displayed correctly.
*   **Steps**:
    1.  Log in and add a few tasks with different details (priorities, due dates, descriptions).
*   **Expected Result**:
    *   Tasks are listed below the input/filter area.
    *   Each task item should display its title, description (if any), status, priority (with color coding on the left border), due date, and category.

**Scenario 3.3.2: Edit Task Details (Title, Description, Due Date, Category)**

*   **Objective**: Verify existing tasks can be edited.
*   **Steps**:
    1.  Log in and ensure at least one task exists.
    2.  For a chosen task, click the "Edit" icon (pencil).
    3.  The task item should become editable.
    4.  Modify the "Title" field.
    5.  Modify the "Description" textarea.
    6.  Change the "Due Date" using the date input.
    7.  Modify the "Category" text input.
    8.  Click the "Save Changes" button (the Edit icon might change to a save icon, or a separate button appears).
*   **Expected Result**:
    *   The task item updates in the list with the new title, description, due date, and category.
    *   The item is no longer in edit mode.

**Scenario 3.3.3: Edit Task Status**

*   **Objective**: Verify task status can be changed.
*   **Steps**:
    1.  Log in and ensure a task exists.
    2.  For a chosen task, locate the "Status" dropdown.
    3.  Change the status (e.g., from "to do" to "in progress").
    4.  If in edit mode, click "Save Changes". If not in edit mode, the change should apply directly.
*   **Expected Result**:
    *   The task's status updates immediately or after saving.

**Scenario 3.3.4: Edit Task Priority**

*   **Objective**: Verify task priority can be changed.
*   **Steps**:
    1.  Log in and ensure a task exists.
    2.  For a chosen task, locate the "Priority" dropdown.
    3.  Change the priority (e.g., from "medium" to "high").
    4.  If in edit mode, click "Save Changes". If not in edit mode, the change should apply directly.
*   **Expected Result**:
    *   The task's priority updates.
    *   The left border color of the task item changes according to the new priority.

**Scenario 3.3.5: Cancel Editing a Task**
*   **Objective**: Verify that changes made during editing can be cancelled.
*   **Steps**:
    1. Log in and ensure a task exists.
    2. Click the "Edit" icon on a task.
    3. Make some changes to the title and description.
    4. Click the "Cancel" button.
*   **Expected Result**:
    *   The task reverts to its original state before editing.
    *   The task is no longer in edit mode.

**Scenario 3.3.6: Delete Task**

*   **Objective**: Verify tasks can be deleted.
*   **Steps**:
    1.  Log in and ensure a task exists.
    2.  For a chosen task, click the "Delete" icon (trash can).
    3.  (Optional: Confirm if there's a confirmation prompt).
*   **Expected Result**:
    *   The task is removed from the list.

### 3.4. Task Filtering and Sorting

**Scenario 3.4.1: Filter by Status**

*   **Objective**: Verify tasks can be filtered by their status.
*   **Steps**:
    1.  Log in and add tasks with different statuses (e.g., 'to do', 'in progress', 'done').
    2.  In the "Filter & Sort Tasks" section, select a specific status (e.g., "in progress") from the "Status" dropdown.
*   **Expected Result**:
    *   Only tasks matching the selected status are displayed in the list.
    *   Selecting "All Statuses" shows all tasks again.

**Scenario 3.4.2: Filter by Priority**

*   **Objective**: Verify tasks can be filtered by their priority.
*   **Steps**:
    1.  Log in and add tasks with different priorities (e.g., 'low', 'medium', 'high').
    2.  In the "Filter & Sort Tasks" section, select a specific priority (e.g., "high") from the "Priority" dropdown.
*   **Expected Result**:
    *   Only tasks matching the selected priority are displayed.
    *   Selecting "All Priorities" shows all tasks again.

**Scenario 3.4.3: Search Tasks**

*   **Objective**: Verify tasks can be searched by keywords in title or description.
*   **Steps**:
    1.  Log in and add tasks with unique keywords in their titles/descriptions (e.g., Task A: "Project Alpha kickoff", Task B: "Beta testing report").
    2.  In the "Search" input field, type a keyword (e.g., "Alpha").
*   **Expected Result**:
    *   Only tasks containing "Alpha" in their title or description are displayed (Task A).
    *   Clearing the search field shows all tasks (respecting other filters).

**Scenario 3.4.4: Sort Tasks**

*   **Objective**: Verify tasks can be sorted by different criteria and orders.
*   **Steps**:
    1.  Log in and add tasks with varying creation dates, due dates, and priorities.
    2.  Test sorting by "Creation Date":
        *   Select "Creation Date" in "Sort By" and "Descending" in "Order". (Expected: Newest tasks first).
        *   Change "Order" to "Ascending". (Expected: Oldest tasks first).
    3.  Test sorting by "Due Date":
        *   Select "Due Date" in "Sort By" and "Ascending" in "Order". (Expected: Tasks with earliest due dates first, tasks without due dates might appear at the end or beginning depending on implementation).
        *   Change "Order" to "Descending".
    4.  Test sorting by "Priority":
        *   Select "Priority" in "Sort By" and "Descending" in "Order". (Expected: Urgent, High, Medium, Low).
        *   Change "Order" to "Ascending". (Expected: Low, Medium, High, Urgent).
*   **Expected Result**:
    *   The task list reorders according to the selected sort criteria and order.

### 3.5. General UI and Responsiveness (Exploratory)

*   **Objective**: Perform general checks for UI consistency and responsiveness.
*   **Steps**:
    1.  Resize your browser window to simulate different screen sizes (desktop, tablet, mobile).
    2.  Navigate through the app, interacting with various elements.
*   **Expected Result**:
    *   The layout adjusts gracefully to different screen sizes.
    *   Buttons, inputs, and other elements are usable on smaller screens.
    *   No major visual glitches or overlapping elements.
    *   Loading states (spinners) appear when data is being fetched or processed.

## 4. Reporting Issues

If you find any bugs or unexpected behavior, please note down:
*   The scenario you were testing.
*   The steps you took.
*   What you expected to happen.
*   What actually happened.
*   Any error messages displayed.
*   Your browser and operating system.

Thank you for helping test The Executive Function!
