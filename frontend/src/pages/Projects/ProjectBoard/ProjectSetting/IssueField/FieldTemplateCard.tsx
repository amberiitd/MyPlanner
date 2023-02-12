import { FC } from "react";
import { fieldBsIconMap } from "./IssueFieldItem";

interface FieldTemplateCardProps{
    label: string;
    id: string;
}

const FieldTemplateCard: FC<FieldTemplateCardProps> = (props) => {
    return (
        <div className="border bg-white py-3 cursor-pointer" style={{
            height: "6em",
            width: '8em',
            padding: '1px'
        }}>
            <div className="text-center">
                <i className={`bi bi-${fieldBsIconMap[props.id]}`}></i>
            </div>
            <div className="text-center">
                {props.label}
            </div>
        </div>
    )
} 

export default FieldTemplateCard;