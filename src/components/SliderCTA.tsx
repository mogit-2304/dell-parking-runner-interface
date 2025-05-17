
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight, ChevronLeft, Bug } from 'lucide-react';

interface SliderCTAProps {
  onComplete: () => void;
  slideText?: string;
  releaseText?: string;
  successText?: string;
  accentColor?: string;
  successHoldTime?: number;
  disabled?: boolean;
  direction?: 'ltr' | 'rtl'; // Left to right (default) or right to left
  showDebugInfo?: boolean; // New prop for toggling debug panel
}

const SliderCTA: React.FC<SliderCTAProps> = ({
  onComplete,
  slideText = "Slide to Enter →",
  releaseText = "Release to Enter",
  successText = "Vehicle Entered",
  accentColor = "#0937b2", // Using the brand primary color
  successHoldTime = 1000,
  disabled = false,
  direction = 'ltr', // Default is left to right
  showDebugInfo = false, // Default hidden
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasTriggeredCallback, setHasTriggeredCallback] = useState(false);
  const [counter, setCounter] = useState(0); // Success counter
  const sliderRef = useRef<HTMLDivElement>(null);
  const buttonSize = 64; // Button width (16 * 4 = 64px)
  const containerWidth = 288; // w-72 = 18rem = 288px
  const maxDragDistance = containerWidth - buttonSize; // Maximum drag distance
  const onCompleteRef = useRef(onComplete);
  
  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  // Reset after completion
  useEffect(() => {
    if (hasCompleted) {
      // Only trigger the callback once per completion
      if (!hasTriggeredCallback) {
        console.log('SliderCTA: Executing onComplete inside effect');
        
        // Increment counter
        setCounter(prevCount => prevCount + 1);
        
        // Small delay to ensure UI is updated before callback
        setTimeout(() => {
          onCompleteRef.current();
        }, 100);
        setHasTriggeredCallback(true);
      }
      
      const timer = setTimeout(() => {
        setHasCompleted(false);
        setOffsetX(0);
        setHasTriggeredCallback(false); // Reset for next use
      }, successHoldTime);
      
      return () => clearTimeout(timer);
    }
  }, [hasCompleted, successHoldTime, hasTriggeredCallback]);
  
  // Handle touch/mouse events
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault(); // Prevent default for touch events
    setIsDragging(true);
  };
  
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let newOffset;
    
    if (direction === 'ltr') {
      // Left to right sliding
      const relativeX = clientX - rect.left;
      // Subtracting half the button width to center the drag point on cursor
      newOffset = Math.max(0, Math.min(relativeX - buttonSize/2, maxDragDistance));
    } else {
      // Right to left sliding
      const relativeX = rect.right - clientX;
      // Subtracting half the button width to center the drag point on cursor
      newOffset = Math.max(0, Math.min(relativeX - buttonSize/2, maxDragDistance));
    }
    
    setOffsetX(newOffset);
  };
  
  const handleDragEnd = () => {
    if (disabled || !isDragging) return;
    setIsDragging(false);
    
    // Consider it completed if dragged more than 80% of the way
    const completionThreshold = maxDragDistance * 0.8;
    
    if (offsetX >= completionThreshold) {
      // Success - action triggered
      setHasCompleted(true);
      setOffsetX(maxDragDistance); // Snap to the end
      
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      
      console.log('SliderCTA: Drag completed successfully');
      // The callback will be triggered in the useEffect
    } else {
      // Reset if not dragged enough
      setOffsetX(0);
    }
  };
  
  // Calculate variables for styling
  const completionPercent = Math.min(100, (offsetX / maxDragDistance) * 100);
  
  // Event handlers for mouse events
  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      handleDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };
  
  // Add and remove document event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Determine button position based on direction
  const getButtonStyle = () => {
    if (direction === 'ltr') {
      return {
        left: 0,
        transform: `translateX(${offsetX}px)`,
      };
    } else {
      return {
        right: 0,
        transform: `translateX(-${offsetX}px)`,
      };
    }
  };

  // Determine progress bar style based on direction
  const getProgressStyle = () => {
    if (direction === 'ltr') {
      return {
        left: 0,
        width: `${completionPercent}%`,
      };
    } else {
      return {
        right: 0,
        width: `${completionPercent}%`,
      };
    }
  };
  
  // Render debug panel if enabled
  const renderDebugInfo = () => {
    if (!showDebugInfo) return null;
    
    return (
      <div className="mt-2 p-2 bg-gray-100 border rounded-md text-xs font-mono">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold">Debug Information</span>
          <Bug className="h-4 w-4 text-gray-500" />
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <div>Position:</div>
          <div>{Math.round(offsetX)}px / {maxDragDistance}px</div>
          
          <div>Completion:</div>
          <div>{Math.round(completionPercent)}%</div>
          
          <div>State:</div>
          <div>
            {isDragging ? "Dragging" : hasCompleted ? "Completed" : "Idle"}
          </div>
          
          <div>Success Count:</div>
          <div>{counter}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`flex flex-col justify-center items-center w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {/* Main slider container */}
      <div 
        ref={sliderRef}
        className={`relative rounded-full h-16 w-72 overflow-hidden ${
          hasCompleted ? '' : 'bg-opacity-20'
        } transition-colors duration-300`}
        style={{ 
          backgroundColor: hasCompleted ? accentColor : `${accentColor}20`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completionPercent}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter') && !disabled) {
            setOffsetX(maxDragDistance);
            handleDragEnd();
          }
        }}
      >
        {/* Slider background progress */}
        <div 
          className="absolute top-0 h-full transition-all duration-100"
          style={{ 
            ...getProgressStyle(),
            backgroundColor: `${accentColor}30`
          }}
        />
      
        {/* Text label */}
        <div 
          className={`absolute inset-0 flex justify-center items-center text-white font-medium ${
            hasCompleted ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          {offsetX > maxDragDistance / 2 ? releaseText : slideText}
        </div>
      
        {/* Success message */}
        {hasCompleted && (
          <div className="absolute inset-0 flex justify-center items-center text-white font-medium">
            {successText}
          </div>
        )}
      
        {/* Draggable button */}
        <div
          className={`absolute top-0 flex justify-center items-center h-16 w-16 rounded-full cursor-grab ${
            isDragging ? 'cursor-grabbing shadow-lg scale-105' : ''
          } ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ 
            backgroundColor: accentColor,
            ...getButtonStyle(),
            transition: isDragging ? 'none' : 'transform 0.15s ease, box-shadow 0.2s ease, scale 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            willChange: 'transform',
          }}
          onMouseDown={disabled ? undefined : handleDragStart}
          onTouchStart={disabled ? undefined : handleDragStart}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0]) {
              handleDragMove(e.touches[0].clientX);
            }
          }}
          onTouchEnd={handleDragEnd}
        >
          {/* Button icon */}
          <div className="text-white">
            {hasCompleted ? (
              <Check className="h-6 w-6" />
            ) : (
              direction === 'ltr' ? (
                <ChevronRight className="h-6 w-6" />
              ) : (
                <ChevronLeft className="h-6 w-6" />
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Debug information panel */}
      {renderDebugInfo()}
    </div>
  );
};

export default SliderCTA;
