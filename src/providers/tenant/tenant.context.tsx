import React from 'react';

export interface TenantContextProps {
  tenant?: string;
  setTenant: (tenant: string) => void;
  // setTenant: (tenant: API.Tenant) => void;
  switchTenant: (tenant?: API.Tenant) => void;
}

export const TenantContext = React.createContext<TenantContextProps>({} as TenantContextProps);