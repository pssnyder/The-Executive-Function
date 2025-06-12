
# The Executive Function - UAT Testing Guide

## 1. Introduction

Welcome to the User Acceptance Testing (UAT) for **The Executive Function**! This application is an intelligent digital assistant designed to augment human cognitive executive functions. It provides AI-powered task creation and management to help users plan, organize, and reduce cognitive load.

Your role as a UAT tester is crucial in ensuring the application is user-friendly, functions as expected, and meets user needs.

## 2. Prerequisites for Testing

*   **Browser**: A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
*   **API Key (Important for AI Features)**:
    *   The AI-powered task parsing relies on a `process.env.API_KEY` for the Gemini API. For UAT, this key should be pre-configured in the testing environment.
    *   **If the API key is NOT configured or is invalid**: The application will use a **mock parsing service**. This means that when you try to parse a task with AI, the details (title, description, priority, etc.) will be pre-filled mock data, not intelligently derived from your input. The mock response will usually indicate this (e.g., "Mock Parsed: ..."). You can still test the UI flow for adding tasks.
*   **Access**: You should have access to the UAT version of the application.

## 3. Core Features to Test

*   **User Authentication**: Registration, Login, Logout.
*   **AI-Powered Task Creation**:
    *   Entering tasks using natural language.
    *   Reviewing and modifying AI-suggested task details.
    *   Adding tasks to the list.
*   **Task Management**:
    *   Viewing task details (title, description, priority, status, due date, category).
    *   Editing existing tasks.
    *   Changing task status and priority.
    *   Deleting tasks.
*   **Task Filtering and Sorting**:
    *   Filtering tasks by status and priority.
    *   Searching for tasks by keywords.
    *   Sorting tasks by creation date, due date, or priority.
*   **User Interface (UI) and User Experience (UX)**:
    *   Overall usability and intuitiveness.
    *   Responsiveness across different screen sizes.
    *   Clarity of information and feedback (e.g., loading states, error messages).

## 4. Testing Walkthrough

Please test the following functionalities thoroughly.

### 4.1. User Authentication

*   **Register a new account**:
    1.  Click "Need an account? Sign Up".
    2.  Enter a unique email and an optional password.
    3.  Click "Sign Up".
    *   **Expected**: You should be logged in and see the main dashboard with a welcome message.
*   **Log out**:
    1.  Click the "Logout" button in the header.
    *   **Expected**: You should be returned to the login screen.
*   **Log in with an existing account**:
    1.  Enter the credentials of the account you registered.
    2.  Click "Sign In".
    *   **Expected**: You should be logged in and see the main dashboard.
*   **Login with a non-existent user (Demo behavior)**:
    1. Try logging in with an email not yet registered.
    *   **Expected (Demo specific)**: The current demo setup might automatically register and log in this new user. Note if this occurs.

### 4.2. AI-Powered Task Creation

1.  **Enter a task using natural language**:
    *   In the "Add New Task with AI" section, type a task description. Examples:
        *   `"Schedule a team meeting for next Monday at 10 AM, high priority, category Work. Agenda: Q4 planning."`
        *   `"Buy milk and eggs tomorrow evening"`
        *   `"Prepare presentation slides due end of week"`
2.  **Parse with AI**:
    *   Click the "Parse with AI" button.
    *   **Expected**:
        *   If API key is working: The "AI Suggested Details" section should appear below, populated with details (title, description, priority, due date, category) intelligently extracted from your input.
        *   If API key is NOT working: Mock data will be shown. Note this.
3.  **Review and Modify AI Suggestions**:
    *   Check if the parsed details are accurate.
    *   Try changing the suggested title, description, priority (dropdown), due date (date picker), or category.
4.  **Add the Task**:
    *   Click the "Add Task" button (green button that appears after successful parsing).
    *   **Expected**: The input field should clear, the AI suggestions should disappear, and the new task should appear in the "Task List" below with the (potentially modified) details.
5.  **Clear AI Suggestion**:
    * After parsing, click "Clear AI Suggestion".
    * **Expected**: The "AI Suggested Details" section disappears. The original input remains.
6.  **Attempt to parse empty input**:
    * Click "Parse with AI" with an empty input field.
    * **Expected**: An error message should appear.

### 4.3. Task Management

*   **View Tasks**:
    *   **Expected**: Added tasks should be listed, displaying title, description (if any), status, priority (with a colored left border indicating priority), due date, and category.
*   **Edit Task Details**:
    1.  For any task, click the "Edit" icon (pencil).
    2.  Modify the title, description, due date (input field), and category (input field).
    3.  Change the "Status" and "Priority" using their respective dropdowns within the edit mode.
    4.  Click "Save Changes" (the edit icon might change or a button appears).
    *   **Expected**: The task updates in the list with your changes. The task exits edit mode.
*   **Cancel Edit**:
    1. Click "Edit", make changes, then click "Cancel".
    * **Expected**: Changes are discarded, task reverts to its previous state.
*   **Quick Status/Priority Change (Outside Edit Mode)**:
    1. For a task *not* in edit mode, try changing its "Status" or "Priority" directly using the dropdowns on the task item.
    * **Expected**: The task should update immediately to reflect the new status or priority (including priority color).
*   **Delete Task**:
    1.  Click the "Delete" icon (trash can) on a task.
    *   **Expected**: The task is removed from the list.

### 4.4. Task Filtering and Sorting

Located in the "Filter & Sort Tasks" section:

*   **Search**:
    1.  Type keywords into the "Search" input.
    *   **Expected**: The task list filters to show only tasks whose title or description match the search term.
*   **Filter by Status**:
    1.  Select different statuses from the "Status" dropdown (e.g., 'to do', 'in progress', 'all').
    *   **Expected**: The list updates to show only tasks with the selected status.
*   **Filter by Priority**:
    1.  Select different priorities from the "Priority" dropdown (e.g., 'high', 'low', 'all').
    *   **Expected**: The list updates to show only tasks with the selected priority.
*   **Sort Tasks**:
    1.  Use the "Sort By" dropdown (Creation Date, Due Date, Priority) and the "Order" dropdown (Ascending, Descending).
    *   **Expected**: The task list reorders based on your selections. For example:
        *   Sort by Priority (Descending): Urgent tasks first.
        *   Sort by Due Date (Ascending): Tasks due soonest first.

### 4.5. General UI and Responsiveness

*   **Visuals**: Are all elements displayed correctly? Is the design aesthetically pleasing and clear?
*   **Responsiveness**: Resize your browser window to simulate different devices (desktop, tablet, mobile).
    *   **Expected**: The layout should adapt without breaking. All buttons and interactive elements should remain usable.
*   **Feedback**:
    *   Are loading indicators (spinners) shown during operations like AI parsing or adding/updating tasks?
    *   Are error messages clear and helpful?

## 5. API Key and Mocking Reminder

As mentioned, the AI-powered task parsing feature's full functionality depends on a correctly configured `API_KEY`. If it's not available during UAT:
*   You will see **mock data** in the "AI Suggested Details" section.
*   The title will likely start with "Mock Parsed: ..."
*   Other fields (description, priority, due date, category) will also be pre-filled mock values.

This allows testing of the UI flow for adding tasks, but not the AI's parsing accuracy. Please note in your feedback if you are observing mock behavior.

## 6. Reporting Feedback

When you encounter issues or have suggestions, please document:

*   **What you were doing** (e.g., "Trying to add a task with input 'X'").
*   **What happened** (e.g., "The due date was parsed incorrectly as Y").
*   **What you expected to happen** (e.g., "Expected due date Z").
*   **If you observed mock AI behavior** (due to missing API key).
*   Any error messages displayed.
*   Your browser and operating system can also be helpful.

Thank you for your valuable contribution to improving The Executive Function!
