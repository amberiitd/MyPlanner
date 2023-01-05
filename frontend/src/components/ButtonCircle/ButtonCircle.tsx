import { FC } from 'react';
import './ButtonCircle.css';

interface ButtonCircleProps{
    size?: 'sm' | 'md' | 'lg';
    label: string;
    showLabel?: boolean;
    bsIcon?: string;
    extraClasses?: string;
    onClick: () => void;
}

const ButtonCircle: FC<ButtonCircleProps> = (props) => {
    return (
        <button className={`text-cut rounded-circle app-button hover-button size-${props.size || 'md'} ${props.extraClasses || 'bg-thm-2'} `}
            onClick={props.onClick}
        >
            {
                props.showLabel?
                <span>{props.label}</span>:
                <i className={`bi bi-${props.bsIcon || 'lightning'}`}></i>
            }
        </button>
    )
}

export default ButtonCircle;