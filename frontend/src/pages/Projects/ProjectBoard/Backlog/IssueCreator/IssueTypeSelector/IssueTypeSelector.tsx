import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../../components/Button/Button';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import './IssueTypeSelector.css';

interface IssueTypeSelectorProps{
}

const IssueTypeSelector: FC<IssueTypeSelectorProps> = (props) => {
    const [selectedIssue, setSelectedIssue] = useState<any>();
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
                    label="Issue Type"
                    hideLabel={true}
                    leftBsIcon={selectedIssue?.leftBsIcon?? 'check'}
                    rightBsIcon={dropdown? 'chevron-up': 'chevron-down'}
                    extraClasses='px-1 btn-as-bg'
                    handleClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div ref={dropdownRef} className={`dropdown-menu shadow-sm bg-light ${dropdown? 'show': ''}`}>
                <div className='bg-white'>
                    <LinkCard 
                        label='Issue Type'
                        showLabel={false}
                        isLoading={false}
                        linkItems={[
                            {
                                label: 'Story',
                                value: 'story',
                                leftBsIcon: 'bookmark'
                            },
                            {
                                label: 'Task',
                                value: 'task',
                                leftBsIcon: 'file-check'
                            }
                        ]}
                        extraClasses='quote'
                        handleClick={(item) => { setSelectedIssue(item); setDropdown(false); }}
                    />
                </div>
                <div className='bg-white mt-1'>
                    <LinkCard 
                        label='Issue Type'
                        showLabel={false}
                        isLoading={false}
                        linkItems={[
                            {
                                label: 'Manage issue Types',
                                value: 'manage-issue-types'
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

export default IssueTypeSelector;