import { isEmpty } from 'lodash';
import { FC } from 'react';
import './CardItem.css';

interface CardItemProps{
    label: string;
    leftBsIcon?: string;
    caption?: string;
}

const CardItem: FC<CardItemProps> = (props) => {

    return(
        <div className='d-flex flex-nowrap rounded shadow-sm card-item w-100'>
            <div className='p-3 px-5 rounded-start card-item-icon d-flex align-items-center'>
                <i className={`bi bi-${props.leftBsIcon || '1-square'}`} style={{fontSize: '200%'}}></i>
            </div>
            <div className='p-3 rounded-end card-item-body d-block'>
                <div>
                    <span className='card-item-label'>{props.label}</span>
                </div>
                <div className='text-grey' hidden={isEmpty(props.caption)}>
                    {props.caption}
                </div>
            </div>
        </div>
    )
}

export default CardItem;