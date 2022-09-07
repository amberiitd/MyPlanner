import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import './IssueCreator.css';
import IssueTypeSelector from './IssueTypeSelector/IssueTypeSelector';

interface IssueCreatorProps{

}

const IssueCreator: FC<IssueCreatorProps>  = (props) => {
    const [active, setActive] = useState(false);
    const [newIssueLabel, setNewissueLabel] = useState('');
    const compRef = useRef<HTMLDivElement>(null);

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
                        <IssueTypeSelector />
                    </div>
                    <div className='w-100'>
                        <input className={`bg-transparent w-100`} type="text" value={newIssueLabel} placeholder='What needs to be done?' onChange={(e) => {setNewissueLabel(e.target.value)}} />
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