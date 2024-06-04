import React from 'react';

interface FormItemContextValue {
  id: string;
}

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);
