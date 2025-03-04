import React, { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

function FeedbackTab({ event, isRegistered }) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isRegistered) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Required</h3>
        <p className="text-gray-500">
          Please register for the event to provide feedback.
        </p>
      </div>
    );
  }

  if (!event.feedback?.isEnabled) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Not Available</h3>
        <p className="text-gray-500">
          Feedback collection has not been enabled for this event.
        </p>
      </div>
    );
  }

  if (feedbackSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-500">
          Your feedback has been submitted successfully. We appreciate your input!
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate required fields
    const requiredQuestions = event.feedback.questions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q => !formData[q.text]);
    
    if (missingRequired.length > 0) {
      toast.error("Please answer all required questions");
      setSubmitting(false);
      return;
    }
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setFeedbackSubmitted(true);
      setSubmitting(false);
      toast.success("Feedback submitted successfully!");
    }, 1000);
  };

  const renderQuestionInput = (question, index) => {
    switch (question.type) {
      case 'star':
        return (
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(question.text, rating)}
                className={`p-1 rounded-full transition-colors ${
                  formData[question.text] >= rating 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Your answer"
            value={formData[question.text] || ''}
            onChange={(e) => handleInputChange(question.text, e.target.value)}
          />
        );
      
      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="10"
              className="w-full"
              value={formData[question.text] || 5}
              onChange={(e) => handleInputChange(question.text, parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        );
      
      default:
        return <p className="text-red-500">Unknown question type</p>;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Feedback</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {event.feedback.questions.map((question, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderQuestionInput(question, index)}
          </div>
        ))}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
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