import React from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
}

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
