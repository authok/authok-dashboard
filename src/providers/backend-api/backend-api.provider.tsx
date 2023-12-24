import React, { useMemo } from "react";
import useRequestWithToken from "@/hooks/useRequestWithToken";
import { APIClient } from "@/api";
import BackendAPIContext from "./context";

export interface BackendAPIProviderProps {
  host: string;
  children?: React.ReactNode;
}

const BackendAPIProvider = ({ host, children }: BackendAPIProviderProps) => {
  const request = useRequestWithToken();

  const client = useMemo(() => {
    const client = new APIClient(host, 'api', request);

    return client;
  }, [host, request]);

  const contextValue = useMemo(() => ({ client }), [client]);

  return (
    <BackendAPIContext.Provider value={contextValue}>
      {children}
    </BackendAPIContext.Provider>
  );
};

export default BackendAPIProvider;