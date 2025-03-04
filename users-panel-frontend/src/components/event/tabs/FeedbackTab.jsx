import React, { useState } from 'react';
import { MessageSquare, Star, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function FeedbackTab({ event, isRegistered }) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Required</h3>
        <p className="text-gray-500 text-center max-w-md">
          Please register for the event to provide your valuable feedback.
        </p>
      </div>
    );
  }

  if (!event.feedback?.isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback Not Available</h3>
        <p className="text-gray-500 text-center max-w-md">
          Feedback collection has not been enabled for this event yet.
        </p>
      </div>
    );
  }

  if (feedbackSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-green-100">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-500 text-center max-w-md">
          Your feedback has been submitted successfully. We appreciate your input and will use it to improve future events.
        </p>
      </div>
    );
  }

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const requiredQuestions = event.feedback.questions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q => !formData[q.text]);
    
    if (missingRequired.length > 0) {
      toast.error("Please answer all required questions");
      setSubmitting(false);
      return;
    }

    try {
      // Call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setFeedbackSubmitted(true);
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'star':
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleInputChange(question.text, rating)}
                    className="relative group p-1.5"
                  >
                    <Star 
                      className={`w-8 h-8 transform transition-all duration-200 
                        ${formData[question.text] >= rating 
                          ? 'text-yellow-400 scale-105 filter drop-shadow-md' 
                          : 'text-gray-200 hover:text-yellow-300 hover:scale-105'
                        } 
                        ${formData[question.text] === rating ? 'animate-pulse' : ''}
                      `}
                      fill={formData[question.text] >= rating ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                    <span className="sr-only">Rate {rating} stars</span>
                    
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {rating === 1 ? 'Poor' : 
                      rating === 2 ? 'Fair' : 
                      rating === 3 ? 'Good' : 
                      rating === 4 ? 'Very Good' : 'Excellent'}
                    </span>
                  </button>
                ))}
              </div>
              {formData[question.text] && (
                <span className="text-sm font-medium text-gray-600 animate-fade-in">
                  {formData[question.text] === 1 ? 'Poor' : 
                  formData[question.text] === 2 ? 'Fair' : 
                  formData[question.text] === 3 ? 'Good' : 
                  formData[question.text] === 4 ? 'Very Good' : 'Excellent'}
                </span>
              )}
            </div>
            {/* Rating labels */}
            <div className="flex justify-between px-2 text-xs text-gray-400">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            rows="3"
            placeholder="Your answer"
            value={formData[question.text] || ''}
            onChange={(e) => handleInputChange(question.text, e.target.value)}
          />
        );
      
      case 'slider':
        return (
          <div className="space-y-3 touch-none">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary touch-none"
                value={formData[question.text] || 5}
                onChange={(e) => handleInputChange(question.text, parseInt(e.target.value))}
                onTouchMove={(e) => {
                  e.preventDefault(); // Prevent page scroll while sliding
                  e.stopPropagation();
                }}
                style={{
                  // Custom slider styling for better mobile experience
                  WebkitAppearance: 'none',
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((formData[question.text] || 5) - 1) * 11.11}%, #e5e7eb ${((formData[question.text] || 5) - 1) * 11.11}%, #e5e7eb 100%)`
                }}
              />
              <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full text-sm font-medium shrink-0">
                {formData[question.text] || 5}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <label 
                key={idx} 
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name={question.text}
                    value={option}
                    checked={formData[question.text] === option}
                    onChange={(e) => handleInputChange(question.text, e.target.value)}
                    className="h-5 w-5 text-primary focus:ring-primary/50 border-gray-300"
                  />
                </div>
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="flex items-center gap-2 text-red-500 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>Unknown question type</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Feedback</h3>
            <p className="text-gray-600">
              Your feedback helps us improve future events. Thank you for taking the time to share your thoughts.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {event.feedback.questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                {index + 1}
              </div>
              <div>
                <label className="block text-gray-900 font-medium">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {question.description && (
                  <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                )}
              </div>
            </div>
            <div className="ml-auto">{renderQuestionInput(question)}</div>
          </div>
        ))}

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm font-medium"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackTab;