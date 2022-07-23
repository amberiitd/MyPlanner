import { FC } from 'react';
import BinaryAction from '../BinaryAction/BinaryAction';
import './CustomLink.css';

interface CustomLinkAction{
    label: string;
    bsIcon: string;
    flipBsIcon?: string;
    handleClick: (event: any) => void;
}

interface CustomLinkProps{
    label: string;
    caption?: string;
    leftBsIcon?: string;
    rightBsIcon?: string;
    actions?: CustomLinkAction[];
    handleClick: (event: any) => void;
}

const CustomLink: FC<CustomLinkProps> = (props) => {

    return (
        <div className='bg-smoke d-flex flex-nowrap p-2 ps-3' onClick={(e)=>{props.handleClick(e)}}>
            {/*  */}
            <div className='pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '150%'}} ></i>
            </div>
            <div className=''>
                {props.label}
                <div className='caption text-cut text-muted'>
                    {props.caption}
                </div>
            </div>
            <div className='ms-auto d-flex flex-nowrap'>
                {
                    props.actions?.map( (action, index) => (
                        // there might be an issue with click action since parent has a click action
                        <BinaryAction key={index}
                            label={action.label}
                            bsIcon0={action.bsIcon}
                            bsIcon1={action.flipBsIcon || action.bsIcon}
                            handleClick={(event: any)=> {action.handleClick(event)}}
                            
                        />
                    ) )
                }
                <div className='' hidden={!props.rightBsIcon}>
                    <i className={`bi bi-${props.rightBsIcon}`} style={{fontSize: '70%'}} ></i>
                </div>
            </div>
        </div>
    )
}

export default CustomLink;