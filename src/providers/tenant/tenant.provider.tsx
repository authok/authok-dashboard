import React, { useMemo, useEffect, useCallback, useState } from "react";
import { TenantContext } from "./tenant.context";
import { useSessionStorageState } from "@umijs/hooks";

export interface TenantProviderProps {
  children?: React.ReactNode;
}

const TenantProvider = (props: TenantProviderProps) => {
  const { children } = props;

  const [tenant, setTenant] = useSessionStorageState('current_tenant');

  const [currentTenant, setCurrentTenant] = useState(undefined);

  const switchTenant = useCallback((_tenant) => {
    // if (_tenant?.id === tenant) return;
    setTenant(_tenant?.id);
    setCurrentTenant(_tenant);
  }, []);

  useEffect(() => {
    if (!tenant) {
      // window.location.pathname = '/';
      // return;
    }

    if (currentTenant) {
      window.location.pathname = `/${currentTenant.region}/${currentTenant.name}`;
    }
  }, [tenant, currentTenant]);

  const contextValue = useMemo(() => ({
    tenant,
    setTenant,
    switchTenant,
  }), [tenant, setTenant, switchTenant]);

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantProvider;