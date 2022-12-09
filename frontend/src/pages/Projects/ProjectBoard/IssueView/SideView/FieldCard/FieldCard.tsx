import { uniqueId } from 'lodash';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { RootState } from '../../../../../../app/store';
import './FieldCard.css';
import {SprintField, StoryPointField} from './FieldInputs';

export type FieldCardId = 'pinned' | 'details'; 
export interface Field{
    label: string;
    value: string;
    component: string;
    fieldCardId: FieldCardId;
}

export interface FieldInputProps{
    id: string;
    value: number | string;
    fieldCardId: FieldCardId;
}

interface FieldCardProps{
    label: string;
    id: FieldCardId;
    fields: Field[];
}

const fieldMap: {
    [key: string]: FC<FieldInputProps>;
} ={
    'sprint': SprintField,
}

const FieldCard: FC<FieldCardProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [searchParam , setSearchParam] = useSearchParams();
    const issue = useSelector((state: RootState) => state.issues.values.find(issue => issue.id === searchParam.get('issueId')));
    return (
        <div className='border rounded'>
            <div className='header p-2 d-flex flex-nowrap cursor-pointer align-items-center' onClick={()=>{setOpen(!open)}}>
                <div className='h6'>
                    {props.label}
                </div>
                <div className='ms-auto'>
                    <i className='bi bi-chevron-down' hidden={open}></i>
                    <i className='bi bi-chevron-up' hidden={!open}></i>
                </div>
            </div>
            {
                open &&
                <div className='p-2  border-top'>
                    {
                        props.fields.map(field => (
                            <div key={uniqueId()} className='my-2'>
                                {
                                    field.component === 'sprint' &&
                                    <SprintField 
                                        id={field.value}
                                        value={issue?.sprintId || ""} 
                                        fieldCardId={props.id}
                                    />
                                }
                                {
                                    field.component === 'story-point' &&
                                    <StoryPointField 
                                        id={field.value}
                                        value={issue?.storyPoint || 0} 
                                        fieldCardId={props.id}
                                    />
                                }
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default FieldCard;