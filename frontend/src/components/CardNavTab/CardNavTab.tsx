import { FC } from 'react';
import './CardNavTab.css';

interface NavTabItem{
    label: string;
}

interface CardNavTabProps{
    options: NavTabItem[];
    selectedOptionIndex: number;
    handleClick: (event: any) => void;
}

const CardNavTab: FC<CardNavTabProps> = (props) => {
    // 
    return (
        <div>
            <div className='d-flex flex-nowrap'>
                {
                    props.options.map((option, index)=>(
                        <div className={`tab pb-1 me-3 text-nowrap ${index === props.selectedOptionIndex? 'tab-active': ''}`} key={index} onClick={()=>{props.handleClick(index)}}>
                            {option.label}
                        </div>
                    ))
                }
            </div>
            <hr className='my-0'/>
        </div>
    )
}

export default CardNavTab;