import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../../components/Button/Button';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import './StageSelector.css';

interface StageSelectorProps{

}

const StageSelector: FC<StageSelectorProps> = (props) => {

    const [selectedStage, setSelectedStage] = useState<any>();
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                    label={selectedStage?.label}
                    rightBsIcon={dropdown? 'chevron-up': 'chevron-down'}
                    extraClasses='px-1 btn-as-light rounded'
                    handleClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div ref={dropdownRef} className={`dropdown-menu dropdown-menu-start shadow-sm bg-light ${dropdown? 'show': ''}`} style={{right: 0}}>
                <div className='bg-white'>
                    <LinkCard 
                        label='Issue Type'
                        showLabel={false}
                        isLoading={false}
                        linkItems={[
                            {
                                label: 'IN PROGRESS',
                                value: 'in-progress',
                            },
                            {
                                label: 'DONE',
                                value: 'done',
                            },
                            {
                                label: 'TO DO',
                                value: 'to-do',
                            }
                        ]}
                        extraClasses='quote'
                        handleClick={(item) => { setSelectedStage(item); setDropdown(false); }}
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
                        extraClasses='quote'
                        handleClick={()=> {}}
                    />
                </div>
            </div>

        </div>
    )
}

export default StageSelector;