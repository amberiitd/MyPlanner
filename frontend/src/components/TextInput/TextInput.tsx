import React, { FC } from 'react';
import styles from './TextInput.module.css';

interface TextInputProps {}

const TextInput: FC<TextInputProps> = () => (
  <div className={styles.TextInput} data-testid="TextInput">
    TextInput Component
  </div>
);

export default TextInput;
