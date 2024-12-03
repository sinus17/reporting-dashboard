import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa6';
import { fetchMondayBoards, fetchMondayWorkspaces } from '../../api/monday';
import { TIKTOK_DEFAULT_CONFIG } from '../../config/tiktok';

interface ApiFormProps {
  platform: 'meta' | 'tiktok' | 'google' | 'monday';
  onSubmit: (data: ApiFormData) => Promise<void>;
  defaultValues?: Partial<ApiFormData>;
  isLoading?: boolean;
}

export interface ApiFormData {
  apiKey?: string;
  apiSecret?: string;
  accountId?: string;
  refreshToken?: string;
  appId?: string;
  defaultBoardId?: string;
  workspaceId?: string;
  redirectUri?: string;
  clientSecret?: string;
}

const formFields = {
  meta: [
    { name: 'apiKey', label: 'Access Token', required: true },
    { name: 'accountId', label: 'Ad Account ID', required: true }
  ],
  tiktok: [
    { 
      name: 'appId', 
      label: 'App ID', 
      required: true, 
      type: 'text',
      defaultValue: TIKTOK_DEFAULT_CONFIG.appId
    },
    { 
      name: 'clientSecret', 
      label: 'App Secret', 
      required: true, 
      type: 'password',
      defaultValue: TIKTOK_DEFAULT_CONFIG.clientSecret
    },
    { 
      name: 'redirectUri', 
      label: 'OAuth Redirect URI', 
      required: true, 
      type: 'url',
      defaultValue: TIKTOK_DEFAULT_CONFIG.redirectUri,
      placeholder: 'https://your-domain.com/tiktok/callback',
      help: 'Must match the redirect URI configured in your TikTok app settings'
    }
  ],
  google: [
    { name: 'apiKey', label: 'Client ID', required: true },
    { name: 'apiSecret', label: 'Client Secret', required: true },
    { name: 'refreshToken', label: 'Refresh Token', required: true }
  ],
  monday: [
    { name: 'apiKey', label: 'API v2 Token', required: true }
  ]
};

export const ApiForm: React.FC<ApiFormProps> = ({
  platform,
  onSubmit,
  defaultValues,
  isLoading = false
}) => {
  const [boards, setBoards] = useState<Array<{ id: string; name: string }>>([]);
  const [workspaces, setWorkspaces] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ApiFormData>({
    defaultValues: {
      ...defaultValues,
      ...(platform === 'tiktok' && {
        appId: TIKTOK_DEFAULT_CONFIG.appId,
        clientSecret: TIKTOK_DEFAULT_CONFIG.clientSecret,
        redirectUri: TIKTOK_DEFAULT_CONFIG.redirectUri
      })
    }
  });

  const apiKey = watch('apiKey');

  useEffect(() => {
    let isMounted = true;

    const loadMondayOptions = async () => {
      if (platform === 'monday' && apiKey && apiKey.length > 0) {
        setIsLoadingOptions(true);
        try {
          const [boardsData, workspacesData] = await Promise.all([
            fetchMondayBoards(apiKey),
            fetchMondayWorkspaces(apiKey)
          ]);
          if (isMounted) {
            setBoards(boardsData);
            setWorkspaces(workspacesData);
          }
        } catch (error) {
          console.error('Failed to load Monday.com options:', error);
        }
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    };

    loadMondayOptions();
    return () => {
      isMounted = false;
    };
  }, [platform, apiKey]);

  const fields = formFields[platform];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(({ name, label, required, type = 'password', placeholder, help, defaultValue }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            id={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            {...register(name as keyof ApiFormData, { 
              required: required ? `${label} is required` : false,
              minLength: {
                value: platform === 'monday' ? 32 : 1,
                message: platform === 'monday' ? 'Invalid API token format' : undefined
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors[name as keyof ApiFormData] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {help && (
            <p className="mt-1 text-sm text-gray-500">{help}</p>
          )}
          {errors[name as keyof ApiFormData] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[name as keyof ApiFormData]?.message}
            </p>
          )}
        </div>
      ))}

      {platform === 'monday' && apiKey && apiKey.length >= 32 && (
        <>
          <div>
            <label htmlFor="workspaceId" className="block text-sm font-medium text-gray-700 mb-1">
              Default Workspace
            </label>
            <select
              id="workspaceId"
              {...register('workspaceId')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
              disabled={isLoadingOptions}
            >
              <option value="">Select a workspace</option>
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="defaultBoardId" className="block text-sm font-medium text-gray-700 mb-1">
              Default Board
            </label>
            <select
              id="defaultBoardId"
              {...register('defaultBoardId')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
              disabled={isLoadingOptions}
            >
              <option value="">Select a board</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {platform === 'tiktok' && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="text-sm text-gray-600">
            Default TikTok credentials are pre-filled. You can:
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Use the default credentials (recommended)</li>
            <li>Or update them with your own TikTok for Business app details</li>
          </ol>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || isLoadingOptions}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {(isLoading || isLoadingOptions) && <FaSpinner className="w-4 h-4 animate-spin" />}
          {platform === 'tiktok' ? 'Continue with TikTok' : 'Save & Connect'}
        </button>
      </div>
    </form>
  );
};