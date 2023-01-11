import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../../components/Button/Button';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import { IssueType, IssueTypeValue } from './issueTypes';
import './IssueTypeSelector.css';

interface IssueTypeSelectorProps{
    selectedIssueTypeValue?: IssueTypeValue;//'story' | 'bug' | 'task';
    handleSelection: (value: string) => void;
    issueTypes: IssueType[];
    excludeSelected?: boolean;
    chevron?: boolean;
}

const IssueTypeSelector: FC<IssueTypeSelectorProps> = (props) => {
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (props.selectedIssueTypeValue){
            setSelectedIssue(props.issueTypes.find(item => item.value === props.selectedIssueTypeValue));
        }
    }, [props.selectedIssueTypeValue])

    useEffect(() =>{
        const handleWindowClick = (e: any) => {
            if (compRef.current && compRef.current.contains(e.target)){
                // if(dropdownRef.current?.contains(e.target)){
                //     return;
                // }
                // console.log('inside selector')
                // setDropdown(!dropdown);
            }
            else{
                // console.log('outside selector')
                setDropdown(false);
            }
        }
        document.addEventListener('click', handleWindowClick, true);
        return () =>{
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [dropdown])

    return (
        <div ref={compRef} className={`dropdown`} >
            <div className='d-flex flex-nowrap'>
                <div>
                    <Button
                        label="Issue Type"
                        hideLabel={true}
                        leftBsIcon={selectedIssue?.leftBsIcon?? 'check'}
                        rightBsIcon={props.chevron? (dropdown? 'chevron-up': 'chevron-down'): undefined}
                        extraClasses='px-1 btn-as-bg'
                        handleClick={()=>{
                            setDropdown(!dropdown);
                        }}
                    />
                </div>
            </div>
            
            <div ref={dropdownRef} className={`dropdown-menu shadow-sm bg-light ${dropdown? 'show': ''}`}
                onClick={(e)=>{e.stopPropagation()}}
            >
                <div className='bg-white'>
                    <LinkCard 
                        label='Issue Type'
                        showLabel={false}
                        isLoading={false}
                        linkItems={props.excludeSelected? props.issueTypes.filter(item => item.value !== (selectedIssue?.value || item.value)): props.issueTypes}
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