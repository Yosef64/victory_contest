"use client";

import * as React from "react";
import {
  CheckCircle,
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

import { useTelegram } from "../hooks/useTelegram";

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

const initialFeedbackState: FeedbackState = {
  questionResponses: {},
  comment: "",
  pollResponse: "",
};

export function FeedbackPage() {
  const [feedback, setFeedback] = React.useState<FeedbackState>(initialFeedbackState);
  const [questions, setQuestions] = React.useState<FeedbackQuestion[]>([]);
  const [pollOptions, setPollOptions] = React.useState<PollOption[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [selectedPollOption, setSelectedPollOption] = React.useState<PollOption | null>(null);
  const [loading, setLoading] = React.useState(true);

  const { user } = useTelegram();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://txnfqqn7-8081.euw.devtunnels.ms";

  // Fetch active feedback questions and poll options
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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
  }, [API_BASE_URL]);

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
        setIsSubmitted(true);
      } else {
        const errorData = await response.text();
        console.error('Failed to submit feedback:', errorData);
        alert('Failed to submit feedback. Please try again.');
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-4 text-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription>
              Your feedback has been received. We appreciate you taking the time
              to help us improve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setFeedback(initialFeedbackState);
                setIsSubmitted(false);
                setShowContactForm(false);
                setSelectedPollOption(null);
              }}
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Share Your Feedback
          </h1>
          <p className="mt-2 text-muted-foreground">
            We value your opinion. Let us know how we can improve.
          </p>
        </header>

        {/* Active Feedback Questions */}
        {questions.filter(q => q.isActive).length > 0 ? (
          questions.filter(q => q.isActive).map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle>Question {index + 1}</CardTitle>
                <CardDescription>
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
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                      <Label htmlFor={`${question.id}-${optionIndex}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No active feedback questions available at the moment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Poll Options */}
        {pollOptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Range</CardTitle>
              <CardDescription>
                Please select the score range that applies to you.
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
              >
                {pollOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.label} id={`poll-${option.id}`} />
                    <Label htmlFor={`poll-${option.id}`} className="text-sm">
                      {option.label} ({option.minScore}-{option.maxScore})
                      {option.requiresContact && (
                        <span className="text-orange-600 ml-2">* Requires contact info</span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Contact Information Form */}
        {showContactForm && selectedPollOption?.requiresContact && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Since your score is {selectedPollOption.minScore}-{selectedPollOption.maxScore},
                we'd like to get in touch with you. Please provide your contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={feedback.contactInfo?.phoneNumber || ""}
                  onChange={(e) => handleContactInfoChange("phoneNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Your Score</Label>
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={feedback.contactInfo?.language || "english"}
                  onValueChange={(value) => handleContactInfoChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="amharic">Amharic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Comments (Optional)</CardTitle>
            <CardDescription>
              Any additional feedback or suggestions you'd like to share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts, suggestions, or any issues you encountered..."
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submission Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </div>
  );
}
