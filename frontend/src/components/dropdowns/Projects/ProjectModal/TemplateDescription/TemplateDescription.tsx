import { FC } from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import './TemplateDescription.css';

interface TemplateDescriptionProps{
    label: string;
    descText?: string;
}
const TemplateDescription: FC<TemplateDescriptionProps> = (props) => {

    return (
        <div>
            <div>
                {props.label}
            </div>
            <p>
                {props.descText}
            </p>
        </div>
    )
}

export default TemplateDescription;