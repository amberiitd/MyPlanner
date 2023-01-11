import { FC, useState } from "react";
import TextCopy from "../../../../../components/TextCopy/TextCopy";
import { CHILD, issueTypes } from "../IssueCreator/IssueTypeSelector/issueTypes";
import IssueTypeSelector from "../IssueCreator/IssueTypeSelector/IssueTypeSelector";
import { Issue } from "../IssueRibbon/IssueRibbon";


interface IssueLinkProps{
    issue: Issue | undefined;
}
const IssueLink: FC<IssueLinkProps> = (props) => {
    const [hover, setHover] = useState(false);
    return (
        <div className='d-flex'
            onMouseLeave={()=>{setHover(false)}}
        >
            <div className='me-1'>
                <IssueTypeSelector 
                    selectedIssueTypeValue={props.issue?.type} 
                    issueTypes={props.issue?.type === 'child' ?[CHILD] : issueTypes}
                    handleSelection={(value: string) => {

                    }}
                />
            </div>
            <a className='text-decor-none text-black underline-hover f-90' href={`issue?issueId=${props.issue?.id}`}
                onMouseEnter={()=>{setHover(true)}}
            >
                {`${props.issue?.projectKey}-${props.issue?.id}`}
            </a>
            <div className="mx-1" hidden={!hover}>
                <TextCopy 
                    text={`${window.location.href}/issue?issueId=${props.issue?.id}`}
                    bsIcon='link-45deg'
                />
            </div>
        </div>
    )
}

export default IssueLink;