import axios from 'axios';
import { handleMetaError } from '../../utils/errors/metaErrors';
import { ConnectionError, createConnectionError, logConnectionError } from '../../utils/errors/connectionErrors';
import { formatValidISO } from '../../utils/date';

export interface MetaConnectionConfig {
  apiKey: string;
  accountId: string;
}

export const verifyMetaConnection = async (config: MetaConnectionConfig): Promise<boolean> => {
  try {
    console.log('[Meta] Verifying connection:', {
      accountId: config.accountId,
      timestamp: formatValidISO(new Date())
    });

    const response = await axios.get(
      `https://graph.facebook.com/v19.0/act_${config.accountId}`,
      {
        params: {
          access_token: config.apiKey,
          fields: 'id,name,account_status'
        }
      }
    );

    console.log('[Meta] Connection verified:', {
      status: response.status,
      accountName: response.data?.name,
      timestamp: formatValidISO(new Date())
    });

    return true;
  } catch (error) {
    const metaError = handleMetaError(error);
    const connectionError = createConnectionError('meta', metaError.message, {
      code: metaError.details.code,
      subcode: metaError.details.subcode,
      originalError: metaError.details.originalError
    });

    logConnectionError(connectionError);
    throw connectionError;
  }
};

export const refreshMetaConnection = async (config: MetaConnectionConfig): Promise<void> => {
  try {
    console.log('[Meta] Refreshing connection:', {
      accountId: config.accountId,
      timestamp: formatValidISO(new Date())
    });

    // Verify the connection is still valid
    await verifyMetaConnection(config);

    console.log('[Meta] Connection refreshed successfully:', {
      accountId: config.accountId,
      timestamp: formatValidISO(new Date())
    });
  } catch (error) {
    const metaError = handleMetaError(error);
    const connectionError = createConnectionError('meta', 'Failed to refresh Meta connection', {
      code: metaError.details.code,
      subcode: metaError.details.subcode,
      originalError: metaError.details.originalError
    });

    logConnectionError(connectionError);
    throw connectionError;
  }
};