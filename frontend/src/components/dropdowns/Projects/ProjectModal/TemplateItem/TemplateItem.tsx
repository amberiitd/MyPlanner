import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import './TemplateItem.css';

interface TemplateItemProps{
    label: string;
    caption?: string;
    leftBsIcon?: string;
    tags?: any[];
}

const TemplateItem: FC<TemplateItemProps> = (props) => {
    const [hover, setHover] = useState(false);

    return (
        <div className={`d-flex flex-nowrap rounded ${hover? 'shadow cursor-pointer': 'shadow-sm'}`} onMouseOver={()=> {setHover(true)}} onMouseOut={()=> {setHover(false)}}>
            <div className='p-3 px-5 rounded-start template-icon d-flex align-items-center'>
                <i className={`bi bi-${props.leftBsIcon || '1-square'}`} style={{fontSize: '200%'}}></i>
            </div>
            <div className='p-3 rounded-end template-body w-100'>
                <div>
                    <span className='item-label'>{props.label}</span>
                </div>
                <div className='text-grey' hidden={isEmpty(props.caption)}>
                    {props.caption}
                </div>
            </div>
            <div className='d-flex flex-nowrap align-items-center right-icon px-3'>
                <i className="bi bi-chevron-right text-grey" style={{fontSize: '75%'}}></i>
            </div>
            
        </div>
    )
}

export default TemplateItem;