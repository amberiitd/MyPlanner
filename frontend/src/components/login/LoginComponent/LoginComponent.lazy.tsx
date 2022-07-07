import React, { lazy, Suspense } from 'react';

const LazyLoginComponent = lazy(() => import('./LoginComponent'));

const LoginComponent = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyLoginComponent {...props} />
  </Suspense>
);

export default LoginComponent;
