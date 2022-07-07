/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { FC } from 'react';
import styles from './Button.module.css';

interface ButtonProps {}

const Button: FC<ButtonProps> = () => (
  <div className={styles.Button} data-testid="Button">
    Button Component
  </div>
);

export default Button;
