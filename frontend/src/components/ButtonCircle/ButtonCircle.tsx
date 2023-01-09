import { FC } from 'react';
import './ButtonCircle.css';

interface ButtonCircleProps{
    size?: 'sm' | 'md' | 'lg' | 'sm-2' | 'md-1';
    label: string;
    showLabel?: boolean;
    bsIcon?: string;
    extraClasses?: string;
    style?: {backgroundColor?: string; cursor?: string;};
    disabled?: boolean;
    onClick: () => void;
}

const ButtonCircle: FC<ButtonCircleProps> = (props) => {
    const className = `text-cut rounded-circle app-button ${props.disabled? 'cursor-none': 'hover-button'} size-${props.size || 'md'} ${props.extraClasses || 'bg-thm-2'} `
    return (
        <div className='rounded-circle border border-2 border-white'>
            <button className={className}
                onClick={props.onClick}
                style={props.style || {}}
            >
                {
                    props.showLabel?
                    <span>{props.label}</span>:
                    <i className={`bi bi-${props.bsIcon || 'lightning'}`}></i>
                }
            </button>
            
        </div>
        
    )
}

export default ButtonCircle;