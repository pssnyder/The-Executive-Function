
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const APP_NAME = "The Executive Function";

export const DEFAULT_TASK_PRIORITY = 'medium';
export const DEFAULT_TASK_STATUS = 'to do';

export const PRIORITY_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  high: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

export const STATUS_OPTIONS = ['to do', 'in progress', 'done', 'blocked'];
export const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

export const MOCK_USER_ID = "mock-user-123"; // For demo purposes without real auth backend
export const MOCK_USER_EMAIL = "user@example.com";