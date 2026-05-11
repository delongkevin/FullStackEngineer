'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { ProjectTutorial } from '../data/tutorials';

interface InteractiveTutorialProps {
  projectTitle: string;
  tutorial?: ProjectTutorial;
}

export default function InteractiveTutorial({ projectTitle, tutorial }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!tutorial || tutorial.steps.length === 0) {
    return (
      <section className="surface-card rounded-xl shadow-lg p-6 mt-8" aria-label="Interactive tutorial">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={22} className="text-blue-500" aria-hidden="true" />
          <h2 className="text-2xl font-bold theme-text-primary">How to Use This Project</h2>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-lg text-center gap-4 py-16 px-6"
          style={{
            background: 'var(--surface-2)',
            border: '2px dashed var(--border-soft)',
          }}
        >
          <BookOpen size={56} className="text-blue-400 opacity-60" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold theme-text-primary">Tutorial Coming Soon</p>
            <p className="theme-text-secondary text-sm mt-2 max-w-md">
              A step-by-step interactive guide for this project will be added here soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const step = tutorial.steps[currentStep];
  const totalSteps = tutorial.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToNextStep = () => {
    setCurrentStep((previousStep) => Math.min(previousStep + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  };

  const goToStep = (index: number) => {
    setCurrentStep(Math.min(Math.max(index, 0), totalSteps - 1));
  };

  return (
    <section className="surface-card rounded-xl shadow-lg p-6 mt-8" aria-label="Interactive tutorial">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen size={22} className="text-blue-500" aria-hidden="true" />
        <h2 className="text-2xl font-bold theme-text-primary">How to Use {projectTitle}</h2>
      </div>
      <p className="theme-text-secondary mb-6 text-sm">
        Follow this interactive guide to learn all the features and how to use this application effectively.
      </p>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {tutorial.steps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToStep(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentStep
                ? 'w-8 bg-blue-500'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to step ${index + 1}`}
            aria-current={index === currentStep ? 'step' : undefined}
          />
        ))}
      </div>

      {/* Tutorial Content */}
      <div className="rounded-lg p-6 mb-6" style={{ background: 'var(--surface-2)' }}>
        {/* Step Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs theme-text-tertiary">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <h3 className="text-2xl font-bold theme-text-primary mb-2">{step.title}</h3>
          <p className="theme-text-secondary">{step.description}</p>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold theme-text-primary mb-3 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-500" aria-hidden="true" />
            Instructions
          </h4>
          <ol className="space-y-3">
            {step.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  <span aria-hidden="true">{index + 1}</span>
                </span>
                <span className="theme-text-secondary pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips (if available) */}
        {step.tips && step.tips.length > 0 && (
          <div className="rounded-lg p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}>
            <h4 className="text-base font-semibold theme-text-primary mb-2 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-500" aria-hidden="true" />
              Pro Tips
            </h4>
            <ul className="space-y-2">
              {step.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1" aria-hidden="true">💡</span>
                  <span className="theme-text-secondary text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isFirstStep
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          aria-label="Previous step"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          Previous
        </button>

        <div className="text-center">
          <p className="text-sm theme-text-tertiary">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        <button
          type="button"
          onClick={goToNextStep}
          disabled={isLastStep}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLastStep
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          aria-label="Next step"
        >
          Next
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Completion Message */}
      {isLastStep && (
        <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-green-800 font-medium text-center">
            🎉 Congratulations! You've completed the tutorial. Now try using the application yourself!
          </p>
        </div>
      )}
    </section>
  );
}
