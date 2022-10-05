import { uniqueId } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addIssue } from '../../../../../app/slices/issueSlice';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import { Project } from '../../../../../model/types';
import './IssueCreator.css';
import IssueTypeSelector from './IssueTypeSelector/IssueTypeSelector';

interface IssueCreatorProps{
    project: Project;
}

const IssueCreator: FC<IssueCreatorProps>  = (props) => {
    const [active, setActive] = useState(false);
    const [newIssueLabel, setNewissueLabel] = useState('');
    const compRef = useRef<HTMLDivElement>(null);
    const [issueType, setIssueType] = useState<any>('bug');

    const dispatch = useDispatch();
    const handleIssueCreation = useCallback((e: any) => {
        if (e.key === 'Enter'){
            if (newIssueLabel.length > 3){
                dispatch(addIssue({
                    id: uniqueId(),
                    type: issueType,
                    label: newIssueLabel,
                    projectKey: props.project.key,
                    sprintId: 'backlog',
                    storyPoint: 0,
                    stage: 'not-started'
                }))
                setNewissueLabel('')
            }
        }
    }, [newIssueLabel, issueType]);

    useEffect(() => {
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }else{
                setActive(false);
            }
        }

        document.addEventListener('click', handleWindowClick, true);
        return () => {
            document.removeEventListener('click', handleWindowClick, true)
        }
    }, [])
    return (
        <div ref={compRef} className='bg-inherit' >
            <div className=''  hidden={!active}>
                <div className='d-flex flex-nowrap align-items-center'>
                    <div className='my-2 me-1 ms-2'>
                        <IssueTypeSelector 
                            selectedIssueTypeValue={issueType} 
                            handleSelection={(value: string) => setIssueType(value)}
                        />
                    </div>
                    <div className='w-100'>
                        <input className={`bg-transparent w-100`} type="text" value={newIssueLabel} placeholder='What needs to be done?' onChange={(e) => {setNewissueLabel(e.target.value)}} onKeyUp={handleIssueCreation}/>
                    </div>
                </div>
            </div>
            

            <div className='w-100' hidden={active}>
                <Button 
                    label='Create issue'
                    leftBsIcon='plus-lg'
                    extraClasses='btn-as-bg py-2 justify-content-start px-3'
                    handleClick={() => {setActive(true)}} 
                />
            </div>
        </div>
    )
}

export default IssueCreator;