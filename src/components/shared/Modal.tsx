import React, { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        
        <div 
          className="relative bg-white rounded-xl shadow-xl max-w-lg w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};