import { useContext } from "react";
import { TenantContext, TenantContextProps } from "./tenant.context";



const useTenantContext = (): TenantContextProps => useContext<TenantContextProps>(TenantContext);

export default useTenantContext;