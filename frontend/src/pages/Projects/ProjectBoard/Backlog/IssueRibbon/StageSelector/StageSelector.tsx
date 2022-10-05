import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../../../../../../app/slices/issueSlice';
import Button from '../../../../../../components/Button/Button';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import { Stage, stages } from './stages';
import './StageSelector.css';

interface StageSelectorProps{
    selectedStage: Stage,
    issueId: string;
}

const StageSelector: FC<StageSelectorProps> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    useEffect(()=> {
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }
            else{
                setDropdown(false);
            }
        };

        document.addEventListener('click', handleWindowClick, true);

        return () => {
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [])

    return (
        <div ref={compRef} className={`dropdown`}>
            <div>
                <Button
                    label={props.selectedStage.label}
                    rightBsIcon={dropdown? 'chevron-up': 'chevron-down'}
                    extraClasses='ps-2 btn-as-light rounded'
                    handleClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div ref={dropdownRef} className={`dropdown-menu dropdown-menu-start shadow-sm bg-light ${dropdown? 'show': ''}`} style={{right: 0}}>
                <div className='bg-white'>
                    <LinkCard 
                        label='Issue Type'
                        showLabel={false}
                        isLoading={false}
                        linkItems={stages}
                        extraClasses='quote'
                        handleClick={(item: Stage) => { 
                            dispatch(updateIssue({id: props.issueId, data: {stage: item.value}})); 
                            setDropdown(false); 
                        }}
                    />
                </div>
                <div className='bg-white mt-1'>
                    <LinkCard 
                        label='Action'
                        showLabel={false}
                        isLoading={false}
                        linkItems={[
                            {
                                label: 'View workflow',
                                value: 'view-workflow'
                            }
                        ]}
                        handleClick={()=> {}}
                    />
                </div>
            </div>

        </div>
    )
}

export default StageSelector;