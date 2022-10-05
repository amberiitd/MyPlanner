import { FC } from 'react';
import './Badge.css';

interface BadgeProps{
    data: string | number;
    extraClasses?: string;
}

const Badge: FC<BadgeProps> = (props) => {
    return (
        <div className={`cursor-default px-1 rounded-pill ${props.extraClasses}`}>
            {props.data}
        </div>
    )
}

export default Badge;