export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: any) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  close: () => void;
  expand: () => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
}

export interface Question {
  id: string;
  question_text: string;
  answer: string;
  explanation: string;
  subject: string;
  grade: string;
  chapter: string;
  multiple_choice: string[];
  difficulty?: "easy" | "medium" | "hard";
}

export interface ContestAnswer {
  question: Question;
  selected_answer: string;
  is_correct: boolean;
  time_taken: number;
}
export interface Student {
  id: string; // or use telegram_id as pk if unique
  telegram_id: string; // link this to submissions or registrations
  name: string;
  age: string; // originally string, but better as date for calculation
  city: string;
  region: string;
  school: string;
  grade: string;
  imgurl?: string;
  isSuspended?: boolean;
}
export interface Achievement {
  name: string;
  description: string;
  type: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate: string;
  progress: string;
}
export interface UserStat {}
export interface Contest {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  subject: string;
  grade: string;
  prize: string;
  active_contestant: Student[];
  questions: Question[];
}

export interface LeaderboardEntry {
  user_id: number;
  user_name: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken: number;
  rank: number;
}

export interface UserStats {
  total_contests: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  average_time: number;
  subjects: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  chapters: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  grades: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
