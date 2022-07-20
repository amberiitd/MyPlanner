import React, { lazy, Suspense } from 'react';

const LazyButton = lazy(() => import('./Button'));

const Button = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyButton {...props} label='Button' handleClick={()=> {}}/>
  </Suspense>
);

export default Button;
