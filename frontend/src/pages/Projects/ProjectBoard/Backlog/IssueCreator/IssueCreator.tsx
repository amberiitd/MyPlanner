import { input } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addIssue } from '../../../../../app/slices/issueSlice';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, Project } from '../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../services/api';
import { Issue } from '../IssueRibbon/IssueRibbon';
import './IssueCreator.css';
import { issueTypes } from './IssueTypeSelector/issueTypes';
import IssueTypeSelector from './IssueTypeSelector/IssueTypeSelector';

interface IssueCreatorProps{
    project: Project;
    cardId: string;
}

const IssueCreator: FC<IssueCreatorProps>  = (props) => {
    const [active, setActive] = useState(false);
    const [newIssueLabel, setNewissueLabel] = useState('');
    const compRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [issueType, setIssueType] = useState<any>('bug');
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const id = uniqueId();
    const dispatch = useDispatch();
    const handleIssueCreation = useCallback((e: any) => {
        if (e.key === 'Enter'){
            if (newIssueLabel.length > 3){
                const newIssue: Issue = {
                    id: uniqueId(),
                    type: issueType,
                    label: newIssueLabel,
                    projectKey: props.project.key,
                    sprintId: props.cardId,
                    storyPoint: 0,
                    stage: 'not-started'
                };
                projectCommonQuery.trigger({
                    action: 'CREATE',
                    data: {projectId: props.project.id , ...newIssue},
                    itemType: 'issue'
                } as CrudPayload)
                .then(()=>{
                    dispatch(addIssue(newIssue));
                    setNewissueLabel('')
                });
            }
        }
    }, [newIssueLabel, issueType]);

    useEffect(() =>{
        const handleCreatorClick = (e: any) => {
            if (compRef.current && compRef.current.contains(e.target)){
                // console.log('inside creator:', id)
                setActive(true);
            }else{
                // console.log('outside creator', id)
                setActive(false);
            }
        }
        document.addEventListener('click', handleCreatorClick, true);
        return () =>{
            document.removeEventListener('click', handleCreatorClick, true);
        }
    }, [])

    return (
        <div ref={compRef} className='bg-inherit' >
           {
                active &&
                <div className=''>
                    <div className='d-flex flex-nowrap align-items-center'>
                        <div className='my-2 me-1 ms-2'>
                            <IssueTypeSelector 
                                selectedIssueTypeValue={issueType} 
                                handleSelection={(value: string) => setIssueType(value)}
                                issueTypes={issueTypes}
                                chevron
                            />
                        </div>
                        <div className='w-100'>
                            <input autoFocus ref={inputRef} className={`bg-transparent w-100`} type="text" value={newIssueLabel} placeholder='What needs to be done?' onChange={(e) => {setNewissueLabel(e.target.value)}} onKeyUp={handleIssueCreation}/>
                        </div>
                    </div>
                </div>
            }
            

            <div className='w-100' hidden={active}>
                <Button 
                    label='Create issue'
                    leftBsIcon='plus-lg'
                    extraClasses='btn-as-bg py-2 justify-content-start px-3'
                    handleClick={() => {
                        // setActive(true); 
                        // if (inputRef.current){
                        //     inputRef.current.focus();
                        // }
                    }} 
                />
            </div>
        </div>
    )
}

export default IssueCreator;