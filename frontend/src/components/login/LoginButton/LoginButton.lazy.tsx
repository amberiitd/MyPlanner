import React, { lazy, Suspense } from 'react';

const LazyLoginButton = lazy(() => import('./LoginButton'));

const LoginButton = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyLoginButton {...props} />
  </Suspense>
);

export default LoginButton;
