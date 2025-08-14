"use client";

import * as React from "react";
import {
  CheckCircle,
  MessageSquare,
  Star,
  
  Sparkles,
  Phone,
  Languages,
  Target,
  Send,
  Heart,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

import { useTelegram } from "../hooks/useTelegram";
import { useState, useEffect } from "react";
import { updateStudentDefaultScoreRange } from "../services/studentServices";

// Define interfaces for the feedback system
interface FeedbackQuestion {
  id: string;
  question: string;
  options: string[];
  isActive: boolean;
}

interface PollOption {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  requiresContact: boolean;
}

interface FeedbackState {
  questionResponses: { [questionId: string]: string };
  comment: string;
  pollResponse: string;
  contactInfo?: {
    phoneNumber: string;
    language: string;
    score: number;
  };
}

interface ExistingFeedbackResponse extends FeedbackState {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
}

const initialFeedbackState: FeedbackState = {
  questionResponses: {},
  comment: "",
  pollResponse: "",
};

// Helper function to calculate progress
const calculateProgress = (feedback: FeedbackState, questions: FeedbackQuestion[], pollOptions: PollOption[]) => {
  let completed = 0;
  let total = 0;
  
  // Count active questions
  const activeQuestions = questions.filter(q => q.isActive);
  total += activeQuestions.length;
  completed += activeQuestions.filter(q => feedback.questionResponses[q.id]).length;
  
  // Count poll response
  if (pollOptions.length > 0) {
    total += 1;
    if (feedback.pollResponse) completed += 1;
  }
  
  // Count contact info if required
  const selectedPoll = pollOptions.find(opt => opt.label === feedback.pollResponse);
  if (selectedPoll?.requiresContact) {
    total += 2; // phone + score
    if (feedback.contactInfo?.phoneNumber) completed += 1;
    if (feedback.contactInfo?.score) completed += 1;
  }
  
  return total > 0 ? (completed / total) * 100 : 0;
};

export function FeedbackPage() {
  const { user } = useTelegram();
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedbackState);
  const [selectedPollOption, setSelectedPollOption] = useState<PollOption | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingFeedback, setExistingFeedback] = useState<ExistingFeedbackResponse | null>(null);
  const [hasExistingFeedback, setHasExistingFeedback] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://txnfqqn7-8081.euw.devtunnels.ms";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, check if student has existing feedback
        if (user?.id) {
          try {
            const existingResponse = await fetch(`${API_BASE_URL}/api/feedback-response/student/${user.id}`);
            if (existingResponse.ok) {
              const existingData = await existingResponse.json();
              setExistingFeedback(existingData.response);
              setHasExistingFeedback(true);
              setLoading(false);
              return; // Don't fetch other data if student already submitted
            }
          } catch (error) {
            console.log('No existing feedback found, proceeding with form');
          }


        }

        // Fetch active feedback questions
        const questionsResponse = await fetch(`${API_BASE_URL}/api/feedback-question/active`);
        console.log('Questions response status:', questionsResponse.status);

        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          console.log('Questions data:', questionsData);
          // Transform snake_case to camelCase for frontend
          const transformedQuestions: FeedbackQuestion[] = (questionsData.questions || []).map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options || [],
            isActive: q.is_active // Transform from snake_case to camelCase
          }));
          setQuestions(transformedQuestions);
        } else {
          console.error('Failed to fetch questions:', questionsResponse.statusText);
        }

        // Fetch poll options
        const pollResponse = await fetch(`${API_BASE_URL}/api/poll-option/`);
        console.log('Poll response status:', pollResponse.status);

        if (pollResponse.ok) {
          const pollData = await pollResponse.json();
          console.log('Poll data:', pollData);
          // Transform snake_case to camelCase for frontend
          const transformedPollOptions: PollOption[] = (pollData.options || []).map((po: any) => ({
            id: po.id,
            label: po.label,
            minScore: po.min_score,
            maxScore: po.max_score,
            requiresContact: po.requires_contact
          }));
          setPollOptions(transformedPollOptions);

          // Now fetch student profile to get default score range (after poll options are loaded)
          if (user?.id) {
            try {
              const studentResponse = await fetch(`${API_BASE_URL}/api/student/${user.id}`);
              if (studentResponse.ok) {
                const studentData = await studentResponse.json();
                if (studentData.student?.defaultScoreRange) {
                  // Set the default score range in the feedback state
                  setFeedback(prev => ({
                    ...prev,
                    pollResponse: studentData.student.defaultScoreRange
                  }));
                  
                  // Find the corresponding poll option to set selectedPollOption
                  const defaultOption = transformedPollOptions.find(opt => opt.label === studentData.student.defaultScoreRange);
                  if (defaultOption) {
                    setSelectedPollOption(defaultOption);
                    if (defaultOption.requiresContact) {
                      setShowContactForm(true);
                    }
                  }
                }
              }
            } catch (error) {
              console.log('Could not fetch student profile, proceeding without default score range');
            }
          }
        } else {
          console.error('Failed to fetch poll options:', pollResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, user?.id]);

  const handleQuestionResponse = (questionId: string, value: string) => {
    setFeedback(prev => ({
      ...prev,
      questionResponses: {
        ...prev.questionResponses,
        [questionId]: value
      }
    }));
  };

  const handlePollResponse = (pollOption: PollOption) => {
    setSelectedPollOption(pollOption);
    setFeedback(prev => ({
      ...prev,
      pollResponse: pollOption.label
    }));

    if (pollOption.requiresContact) {
      setShowContactForm(true);
    } else {
      setShowContactForm(false);
    }
  };

  const handleContactInfoChange = (field: string, value: string | number) => {
    console.log('Setting contact info field:', field, 'to value:', value);
    setFeedback(prev => {
      const newContactInfo = {
        ...prev.contactInfo,
        [field]: field === 'score' ? (typeof value === 'string' ? parseInt(value) || 0 : value) : value
      };
      console.log('New contact info:', newContactInfo);
      return {
        ...prev,
        contactInfo: newContactInfo as any
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show confirmation dialog for score range selection
    if (feedback.pollResponse) {
      const confirmed = window.confirm(
        "⚠️ IMPORTANT: Your score range selection can only be submitted ONCE and cannot be changed later.\n\n" +
        "This ensures fair assessment as entrance exams are typically taken only once.\n\n" +
        "Are you sure you want to proceed with your current selection?"
      );
      
      if (!confirmed) {
        return;
      }
    }
    
    setIsSubmitting(true);

    try {
      // Convert question responses to the expected format
      const questionResponsesMap: { [key: string]: { question_id: string; selected_option: string } } = {};
      Object.keys(feedback.questionResponses).forEach(questionId => {
        questionResponsesMap[questionId] = {
          question_id: questionId,
          selected_option: feedback.questionResponses[questionId]
        };
      });

      const feedbackData = {
        student_id: user?.id?.toString() || "unknown",
        student_name: user?.first_name || "Unknown User",
        question_responses: questionResponsesMap,
        comment: feedback.comment,
        poll_response: feedback.pollResponse,
        contact_info: feedback.contactInfo ? {
          phone_number: feedback.contactInfo.phoneNumber, // Convert to snake_case
          language: feedback.contactInfo.language,
          score: feedback.contactInfo.score || 0 // Ensure score is not undefined
        } : undefined,
        language: feedback.contactInfo?.language || "english"
      };

      console.log('Submitting feedback data:', feedbackData);
      console.log('Contact info being sent:', feedbackData.contact_info);

      const response = await fetch(`${API_BASE_URL}/api/feedback-response/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        // Save the score range as the student's permanent default
        if (feedback.pollResponse && user?.id) {
          try {
            await updateStudentDefaultScoreRange(user.id.toString(), feedback.pollResponse);
            console.log('Score range saved as default for student');
          } catch (error) {
            console.error('Failed to save default score range:', error);
            // Don't fail the entire submission if this fails
          }
        }
        
        setIsSubmitted(true);
      } else {
        const errorData = await response.text();
        console.error('Failed to submit feedback:', errorData);
        
        // Check if it's a duplicate submission error
        if (errorData.includes("already submitted")) {
          alert('You have already submitted feedback. Score range selection can only be done once.');
        } else {
          alert('Failed to submit feedback. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    // Check if all active questions have responses
    const allQuestionsAnswered = questions
      .filter(q => q.isActive)
      .every(q => feedback.questionResponses[q.id]);

    // Check if poll response is selected
    const pollAnswered = feedback.pollResponse !== "";

    // If poll requires contact, check if contact info is provided
    const contactInfoValid = selectedPollOption?.requiresContact
      ? feedback.contactInfo?.phoneNumber && feedback.contactInfo?.score
      : true;

    return allQuestionsAnswered && pollAnswered && contactInfoValid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  // Show read-only view if student has already submitted feedback
  if (hasExistingFeedback && existingFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Feedback Already Submitted
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Thank you for your previous feedback! Your score range selection has been recorded.
            </p>
          </div>

          {/* Previous Submission Summary */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-2 border-green-200 dark:border-green-700">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-green-800 dark:text-green-200">
                Your Previous Submission
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Submitted on {(() => {
                  try {
                    if (!existingFeedback.submittedAt) return 'Unknown date';
                    const date = new Date(existingFeedback.submittedAt);
                    if (isNaN(date.getTime())) return 'Invalid date';
                    return date.toLocaleDateString();
                  } catch (error) {
                    console.warn('Error formatting submittedAt date:', error);
                    return 'Unknown date';
                  }
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Range Selection */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Score Range Selected</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {existingFeedback.pollResponse}
                  </Badge>
                  {existingFeedback.contactInfo && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Contact Info Provided
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact Information (if provided) */}
              {existingFeedback.contactInfo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-blue-700 dark:text-blue-300">Phone Number</Label>
                      <p className="text-blue-800 dark:text-blue-200 font-medium">{existingFeedback.contactInfo.phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-blue-700 dark:text-blue-300">Your Score</Label>
                      <p className="text-blue-800 dark:text-blue-200 font-medium">{existingFeedback.contactInfo.score} points</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comment (if provided) */}
              {existingFeedback.comment && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">Your Comment</h3>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 italic">"{existingFeedback.comment}"</p>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-amber-600">ℹ️</div>
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      Score range selection can only be done once per student. This ensures fair assessment 
                      as entrance exams are typically taken only once in a student's academic journey.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          {/* Floating elements for celebration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-yellow-400 animate-bounce">
              <Star className="w-6 h-6" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-20 right-16 text-purple-400 animate-bounce">
              <Sparkles className="w-5 h-5" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-20 left-20 text-blue-400 animate-bounce">
              <Heart className="w-4 h-4" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="absolute top-32 left-1/3 text-green-400 animate-bounce">
              <Trophy className="w-5 h-5" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="absolute bottom-32 right-20 text-pink-400 animate-bounce">
              <Zap className="w-4 h-4" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>

          <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
            <CardHeader className="text-center space-y-6 pb-2">
              {/* Success animation */}
              <div className="relative mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-4 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-30"></div>
              </div>
              
              {/* Success message */}
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Fantastic! 🎉
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  Your feedback has been received and your score range selection is now permanent!
                </CardDescription>
              </div>

              {/* Impact message */}
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  Thank you for sharing your valuable insights. Your score range selection has been recorded 
                  and cannot be changed, as this ensures fair assessment for all students.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                    ✅ Your score range selection is now permanent and cannot be modified
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-2">
              {/* Thank you badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <Heart className="w-3 h-3 mr-1" />
                  Much Appreciated
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  Valuable Input
                </Badge>
              </div>

              {/* Action button */}
              <Button
                onClick={() => {
                  setFeedback(initialFeedbackState);
                  setIsSubmitted(false);
                  setShowContactForm(false);
                  setSelectedPollOption(null);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Share More Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(feedback, questions, pollOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-8 pt-8">
        <div className="w-full max-w-2xl">
          
          {/* Beautiful Header Section */}
          <div className="text-center mb-8 space-y-6">
            <div className="space-y-4">
              {/* Icon and title */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Share Your Feedback
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  Your insights matter! Help us create an even better experience for everyone.
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {progress > 0 && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    <Target className="w-3 h-3 mr-1" />
                    Keep going! You're doing great
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Active Feedback Questions */}
            {questions.filter(q => q.isActive).length > 0 ? (
              questions.filter(q => q.isActive).map((question, index) => {
                const isAnswered = feedback.questionResponses[question.id];
                return (
                  <Card 
                    key={question.id} 
                    className={`transition-all duration-300 hover:shadow-lg border-2 ${
                      isAnswered 
                        ? 'border-green-200 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20' 
                        : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
                    }`}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isAnswered 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {isAnswered ? <CheckCircle className="w-4 h-4" /> : index + 1}
                          </div>
                          <CardTitle className="text-lg">
                            Question {index + 1}
                          </CardTitle>
                        </div>
                        {isAnswered && (
                          <Badge variant="success" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Answered
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {question.question}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={feedback.questionResponses[question.id] || ""}
                        onValueChange={(value) => handleQuestionResponse(question.id, value)}
                        className="space-y-3"
                      >
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex} 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <RadioGroupItem 
                              value={option} 
                              id={`${question.id}-${optionIndex}`}
                              className="text-blue-600"
                            />
                            <Label 
                              htmlFor={`${question.id}-${optionIndex}`} 
                              className="text-sm flex-1 cursor-pointer group-hover:text-blue-600 transition-colors"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                <CardContent className="pt-8 pb-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No active feedback questions available at the moment.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Check back later for new questions!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Poll Options */}
            {pollOptions.length > 0 && (
              <>
                {/* Warning Notice for Score Range Selection */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-red-600 mt-0.5">🚨</div>
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                        Critical: One-Time Selection
                      </h3>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        <strong>This score range selection can only be made ONCE and cannot be changed later.</strong> 
                        Choose carefully as this will be your permanent record for entrance exam assessment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Show if student already has a default score range */}
                {feedback.pollResponse && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-green-600 mt-0.5">✅</div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                          Default Score Range Loaded
                        </h3>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Your previously selected score range <strong>"{feedback.pollResponse}"</strong> has been loaded as your default selection.
                          This selection is permanent and cannot be changed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Card className={`transition-all duration-300 hover:shadow-lg border-2 ${
                  feedback.pollResponse 
                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20' 
                    : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
                }`}>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        feedback.pollResponse 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        <Target className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-lg">Score Range Selection</CardTitle>
                    </div>
                    {feedback.pollResponse && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                    Please select the score range that best applies to your recent performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={feedback.pollResponse}
                    onValueChange={(value) => {
                      const option = pollOptions.find(opt => opt.label === value);
                      if (option) {
                        handlePollResponse(option);
                      }
                    }}
                    className="space-y-3"
                    disabled={feedback.pollResponse !== ""}
                  >
                    {pollOptions.map((option) => (
                      <div 
                        key={option.id} 
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all group ${
                          feedback.pollResponse !== "" 
                            ? 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                            : 'border-transparent hover:border-blue-200 hover:bg-blue-50/50 dark:hover:border-blue-700 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.label} 
                          id={`poll-${option.id}`}
                          className="text-blue-600"
                          disabled={feedback.pollResponse !== ""}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={`poll-${option.id}`} 
                            className="text-sm font-medium cursor-pointer group-hover:text-blue-600 transition-colors"
                          >
                            {option.label}
                          </Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {option.minScore}-{option.maxScore} points
                            </Badge>
                            {option.requiresContact && (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                <Phone className="w-3 h-3 mr-1" />
                                Contact Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              </>
            )}

            {/* Contact Information Form */}
            {showContactForm && selectedPollOption?.requiresContact && (
              <Card className="border-2 border-orange-200 bg-orange-50/50 dark:border-orange-700 dark:bg-orange-900/20 animate-in slide-in-from-top-4 duration-500">
                <CardHeader className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
                      Contact Information Required
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-orange-700 dark:text-orange-300">
                    Great score range ({selectedPollOption.minScore}-{selectedPollOption.maxScore})! 
                    We'd love to connect with you. Please share your contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={feedback.contactInfo?.phoneNumber || ""}
                      onChange={(e) => handleContactInfoChange("phoneNumber", e.target.value)}
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="score" className="text-sm font-medium flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Your Exact Score</span>
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min={selectedPollOption.minScore}
                      max={selectedPollOption.maxScore}
                      placeholder={`Enter your score (${selectedPollOption.minScore}-${selectedPollOption.maxScore})`}
                      value={feedback.contactInfo?.score || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleContactInfoChange("score", value === "" ? 0 : parseInt(value) || 0);
                      }}
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="language" className="text-sm font-medium flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>Preferred Language</span>
                    </Label>
                    <Select
                      value={feedback.contactInfo?.language || "english"}
                      onValueChange={(value) => handleContactInfoChange("language", value)}
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">🇺🇸 English</SelectItem>
                        <SelectItem value="amharic">🇪🇹 Amharic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-600 transition-all duration-300">
              <CardHeader className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                  Help us improve! Share any additional feedback, suggestions, or experiences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What did you think about the contest? Any suggestions for improvement? We'd love to hear your thoughts..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Optional but appreciated</span>
                  <span className="text-xs text-gray-400">{feedback.comment.length}/500</span>
                </div>
              </CardContent>
            </Card>

            {/* Submission Button */}
            <div className="flex flex-col space-y-4 pt-4">
              {!isFormValid() && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Please complete all required fields to submit your feedback
                    </span>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl' 
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Your Feedback...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>{feedback.pollResponse !== "" ? "Submit Feedback with Default Score Range" : "Submit Feedback"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
