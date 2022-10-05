import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../../components/Button/Button';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import { issueTypes } from './issueTypes';
import './IssueTypeSelector.css';

interface IssueTypeSelectorProps{
    selectedIssueTypeValue?: 'story' | 'bug' | 'task';
    handleSelection: (value: string) => void;
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


    useEffect(() => {
        if (props.selectedIssueTypeValue){
            setSelectedIssue(issueTypes.find(item => item.value === props.selectedIssueTypeValue));
        }
    }, [props.selectedIssueTypeValue])

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
                        linkItems={issueTypes.filter(item => item.value !== (selectedIssue?.value || item.value))}
                        extraClasses='quote'
                        handleClick={(item) => { setSelectedIssue(item); setDropdown(false); props.handleSelection(item.value)}}
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
                        handleClick={()=> {}}
                    />
                </div>
            </div>

        </div>
    )
}

export default IssueTypeSelector;