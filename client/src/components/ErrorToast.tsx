import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorToastProps {
  message: string;
  title?: string;
  onDismiss: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function ErrorToast({ 
  message, 
  title = "Koneksi Bermasalah", 
  onDismiss, 
  autoClose = true, 
  duration = 5000 
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (autoClose) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  return (
    <div 
      className={`fixed top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button 
          onClick={handleDismiss}
          className="ml-auto p-1 hover:bg-red-600 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
