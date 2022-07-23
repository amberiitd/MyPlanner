import { FC, useState } from 'react';
import CardNavTab from '../CardNavTab/CardNavTab';
import './TabbedCard.css';

interface TabItem{
    label: string;
    bodyElement: JSX.Element;
    footerElement?: JSX.Element;
}

interface TabbedCardProps{
    tabItems: TabItem[]
}

const TabbedCard: FC<TabbedCardProps> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    return (
        <div className='pt-2'>
            <div className='px-3 mb-2'>
                <CardNavTab 
                    options={props.tabItems.map((item) => ({label: item.label}))}
                    selectedOptionIndex={selectedTabIndex}
                    handleClick={(selectIndex: number)=>{setSelectedTabIndex(selectIndex)}}
                />
            </div>
            
            {props.tabItems[selectedTabIndex].bodyElement}
            <div hidden={!props.tabItems[selectedTabIndex].footerElement}>
                <hr className='w-100 m-0'/>
                {props.tabItems[selectedTabIndex].footerElement}
            </div>
            
        </div>
    )
}

export default TabbedCard;