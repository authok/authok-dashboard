
import React, { createContext, useContext } from 'react';


export const FormDisabledContext = createContext({
  disabled: false,
  setDisabled: () => { }
});

function CustomFormItemHoc(component: any) {
  const Component = component;
  return function CustomItem(props: any) {
    const { disabled } = useContext(FormDisabledContext);
    return <Component disabled={disabled} {...props} />;
  };
}

export default CustomFormItemHoc;