import React, { useState } from 'react';
import { api } from '../utils/api';
import { toast } from 'react-hot-toast';

export const HelloWorld: React.FC = () => {
  const [response, setResponse] = useState<{ message: string; timestamp: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestApi = async () => {
    try {
      setIsLoading(true);
      const data = await api.hello();
      setResponse(data);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to fetch hello message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <button
        onClick={handleTestApi}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Test API'}
      </button>

      {response && (
        <div className="space-y-2">
          <p className="text-lg font-medium">{response.message}</p>
          <p className="text-sm text-gray-500">
            Timestamp: {new Date(response.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};