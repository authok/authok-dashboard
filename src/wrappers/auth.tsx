import React from 'react';
import { Redirect } from 'umi'
import { useAuthok } from '@authok/authok-react';

export default (props: any) => {
  const { isAuthenticated } = useAuthok();
  if (isAuthenticated) {
    return <>{props.children }</>;
  } else {
    return <Redirect to="/login" />;
  }
}