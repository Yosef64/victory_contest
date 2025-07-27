"use client";

import * as React from "react";
import {
  Smile,
  Frown,
  Meh,
  Bug,
  Lightbulb,
  Palette,
  MessageSquareWarning,
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
import { cn } from "../lib/utils";

// Define the structure for our form state
interface FeedbackState {
  experience: "good" | "neutral" | "bad" | "";
  category: "bug" | "feature" | "design" | "other" | "";
  comment: string;
  [key: string]: string; // For dynamic question ratings
}

const initialFeedbackState: FeedbackState = {
  experience: "",
  category: "",
  comment: "",
};

// Define our feedback questions
const feedbackQuestions = [
  { id: "clarity", label: "How clear were the instructions?" },
  { id: "navigation", label: "How easy was it to navigate the app?" },
  { id: "performance", label: "How would you rate the app's performance?" },
];

export function FeedbackPage() {
  const [feedback, setFeedback] =
    React.useState<FeedbackState>(initialFeedbackState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleInputChange = (field: keyof FeedbackState, value: string) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting feedback:", feedback);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // The form is valid if the user has selected an experience and a category
  const isFormValid = feedback.experience && feedback.category;

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-4 text-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
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

        {/* Overall Experience Card */}
        <Card>
          <CardHeader>
            <CardTitle>How was your overall experience?</CardTitle>
            <CardDescription>
              Select one option that best describes your feeling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={feedback.experience}
              onValueChange={(value) => handleInputChange("experience", value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { value: "good", label: "Good", Icon: Smile },
                { value: "neutral", label: "Okay", Icon: Meh },
                { value: "bad", label: "Bad", Icon: Frown },
              ].map(({ value, label, Icon }) => (
                <Label
                  key={value}
                  htmlFor={`experience-${value}`}
                  className={cn(
                    "flex flex-col dark:bg-gray-700 dark:border-none dark:text-gray-100 hover:dark:bg-gray-600 hover:dark:text-white items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                    feedback.experience === value && "border-primary"
                  )}
                >
                  <RadioGroupItem
                    value={value}
                    id={`experience-${value}`}
                    className="sr-only"
                  />
                  <Icon className="w-8 h-8 mb-2" />
                  {label}
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Detailed Feedback Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tell us more</CardTitle>
            <CardDescription>
              Please provide details about your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">
                What kind of feedback do you have?
              </Label>
              <Select
                value={feedback.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">
                    <Bug className="inline-block w-4 h-4 mr-2" /> Bug Report
                  </SelectItem>
                  <SelectItem value="feature">
                    <Lightbulb className="inline-block w-4 h-4 mr-2" /> Feature
                    Request
                  </SelectItem>
                  <SelectItem value="design">
                    <Palette className="inline-block w-4 h-4 mr-2" /> Design
                    Suggestion
                  </SelectItem>
                  <SelectItem value="other">
                    <MessageSquareWarning className="inline-block w-4 h-4 mr-2" />{" "}
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Your comments</Label>
              <Textarea
                id="comment"
                placeholder="Describe the bug, or tell us what you'd like to see..."
                value={feedback.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Specific Questions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Specifics</CardTitle>
            <CardDescription>
              Rate the following aspects of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {feedbackQuestions.map((q) => (
              <div key={q.id}>
                <Label className="text-base">{q.label}</Label>
                <RadioGroup
                  value={feedback[q.id]}
                  onValueChange={(value) => handleInputChange(q.id, value)}
                  className="flex items-center space-x-4 mt-2"
                >
                  <Label htmlFor={`${q.id}-poor`}>Poor</Label>
                  <RadioGroupItem value="1" id={`${q.id}-1`} />
                  <RadioGroupItem value="2" id={`${q.id}-2`} />
                  <RadioGroupItem value="3" id={`${q.id}-3`} />
                  <RadioGroupItem value="4" id={`${q.id}-4`} />
                  <RadioGroupItem value="5" id={`${q.id}-5`} />
                  <Label htmlFor={`${q.id}-excellent`}>Excellent</Label>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submission Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </div>
  );
}
