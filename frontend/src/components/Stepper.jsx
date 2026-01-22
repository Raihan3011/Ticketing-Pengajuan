import React, { useState, Children, useRef, useLayoutEffect } from 'react'

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Kembali',
  nextButtonText = 'Lanjut',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-4xl rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 ${stepCircleContainerClassName}`}
      >
        <div className={`${stepContainerClassName} flex w-full items-center p-4`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-4 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-4 pb-4 ${footerClassName}`}>
            <div className={`mt-4 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'pointer-events-none opacity-50 text-gray-400'
                      : 'text-gray-700 hover:text-blue-800 border border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="px-6 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-medium hover:shadow-lg hover:shadow-blue-900/25 transition-all"
                {...nextButtonProps}
              >
                {isLastStep ? 'Selesai' : nextButtonText}
              </button>
            </div>
          </div>
        )}
        
        {isCompleted && (
          <div className={`px-4 pb-4 ${footerClassName}`}>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Langkah Selesai!</h4>
                <p className="text-sm text-gray-700 mb-4">Anda sudah memahami cara membuat laporan</p>
              </div>
              <button
                onClick={() => updateStep(1)}
                className="px-6 py-2 rounded-lg border border-blue-200 text-gray-700 font-medium hover:border-blue-400 hover:text-blue-800 hover:bg-blue-50 transition-all"
              >
                Lihat Ulang Langkah
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = ''
}) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', height: isCompleted ? 0 : 'auto' }}
      className={className}
    >
      {!isCompleted && (
        <div key={currentStep} style={{ position: 'relative' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </div>
  );
}

export function Step({ children }) {
  return <div className="p-4">{children}</div>;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
    >
      <div
        style={{
          scale: 1,
          backgroundColor: status === 'inactive' ? '#dbeafe' : status === 'active' ? '#1d4ed8' : '#1e40af',
          color: status === 'inactive' ? '#3b82f6' : '#ffffff'
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold shadow-sm transition-all duration-300"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : (
          <span className="text-sm font-bold">{step}</span>
        )}
      </div>
    </div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="relative mx-2 h-1 flex-1 overflow-hidden rounded bg-blue-100">
      <div
        className="absolute left-0 top-0 h-full transition-all duration-400"
        style={{
          width: isComplete ? '100%' : '0%',
          backgroundColor: isComplete ? '#1e40af' : 'transparent'
        }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}