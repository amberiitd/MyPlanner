import React, { lazy, Suspense } from 'react';

const LazyTextInput = lazy(() => import('./TextInput'));

const TextInput = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyTextInput {...props} />
  </Suspense>
);

export default TextInput;
