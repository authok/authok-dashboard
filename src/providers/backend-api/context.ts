import { createContext, useContext } from 'react';
import { APIClient } from '@/api';

export interface BackendAPIContextProps {
  client: APIClient;
}

const BackendAPIContext: React.Context<BackendAPIContextProps> = createContext({} as BackendAPIContextProps);

export const useBackendAPI = () => useContext(BackendAPIContext);

export default BackendAPIContext;
