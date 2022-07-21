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
    bsIcon?: string;
    actions?: CustomLinkAction[] 
}

const CustomLink: FC<CustomLinkProps> = (props) => {

    return (
        <div className='bg-smoke d-flex flex-nowrap p-2'>
            <div className='ms-3' hidden={!props.bsIcon}>
                <i className={`bi bi-${props.bsIcon}`} style={{fontSize: '150%'}}></i>
            </div>
            <div className='ms-2'>
                {props.label}
                <div className='caption text-cut text-muted'>
                    {props.caption}
                </div>
            </div>
            <div className='ms-auto d-flex flex-nowrap'>
                {
                    props.actions?.map( (action, index) => (
                        <BinaryAction key={index}
                            label={action.label}
                            bsIcon0={action.bsIcon}
                            bsIcon1={action.flipBsIcon || action.bsIcon}
                            handleClick={(event: any)=> {action.handleClick(event)}}
                            
                        />
                    ) )
                }
            </div>
        </div>
    )
}

export default CustomLink;