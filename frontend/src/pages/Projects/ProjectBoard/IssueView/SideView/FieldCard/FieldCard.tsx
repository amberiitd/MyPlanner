import { uniqueId } from 'lodash';
import { FC, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { updateIssue } from '../../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../../app/store';
import { useQuery } from '../../../../../../hooks/useQuery';
import { CrudPayload } from '../../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../../services/api';
import { ProjectBoardContext } from '../../../ProjectBoard';
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
    onEdit?: (data: any)=> void;
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
    const {openProject} = useContext(ProjectBoardContext);
    const [searchParam , setSearchParam] = useSearchParams();
    const issue = useSelector((state: RootState) => state.issues.values.find(issue => issue.id === searchParam.get('issueId')));
    const projectCommonQuery = useQuery((payload: CrudPayload)=> projectCommonCrud(payload));
    const dispatch = useDispatch();

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
                open && props.fields.length > 0 &&
                <div className='p-2  border-top'>
                    {
                        props.fields.map((field, index) => (
                            <div key={`field-card-${index}`} className='my-2'>
                                {
                                    field.component === 'sprint' &&
                                    <SprintField 
                                        id={field.value}
                                        value={issue?.sprintId || ""} 
                                        fieldCardId={props.id}
                                        onEdit={(data) => {
                                            if(!issue) return;
                                            projectCommonQuery.trigger({
                                                action: 'UPDATE',
                                                data: {
                                                    projectId: openProject?.id,
                                                    id: issue.id,
                                                    sprintId: data.value
                                                },
                                                itemType: 'issue'
                                            } as CrudPayload)
                                            .then(()=>{
                                                dispatch(updateIssue({
                                                    id: issue.id, 
                                                    data: {
                                                        sprintId: data.value
                                                    }
                                                }));
                                            });
                                        }}
                                    />
                                }
                                {
                                    field.component === 'story-point' &&
                                    <StoryPointField 
                                        id={field.value}
                                        value={issue?.storyPoint || 0} 
                                        fieldCardId={props.id}
                                        onEdit={(data)=>{
                                            if(!issue) return;
                                            projectCommonQuery.trigger({
                                                action: 'UPDATE',
                                                data: {
                                                    projectId: openProject?.id,
                                                    id: issue.id,
                                                    storyPoint: data
                                                },
                                                itemType: 'issue'
                                            } as CrudPayload)
                                            .then(()=>{
                                                dispatch(updateIssue({
                                                    id: issue.id, 
                                                    data: {
                                                        storyPoint: data
                                                    }
                                                }));
                                            });
                                        }}
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