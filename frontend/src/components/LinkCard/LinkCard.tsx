import { isEmpty } from 'lodash';
import { FC } from 'react';
import CustomOption from '../CustomOption/CustomOption';
import './LinkCard.css';

export interface LinkItem{
    label: string;
    value: string;
    href?: string;
    htmlId?: string;
}
interface LinkCardProps{
    label: string;
    showLabel: boolean;
    isLoading: boolean;
    linkItems: LinkItem[];
    selectedLinks?: any[];
    extraClasses?: string;
    emptyElement?: JSX.Element;
    handleClick: (event: any) => void;
}

const LinkCard: FC<LinkCardProps> = (props) => {
    
    
    return (
        <div className='w-100'>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            {
                props.linkItems.map((item, index) => {
                    return  item.href ?
                        (<a className='text-decor-none' id={item.htmlId || ''} key ={`custom-link-${index}`} href={item.href}>
                            <CustomOption {...item} 
                                extraClasses={props.extraClasses + (props.selectedLinks && props.selectedLinks.map(link => link.value).includes(item.value)? ' quote-static': '')}
                            />
                        </a>) :
                        (<div id={item.htmlId || ''} key ={`custom-link-${index}`} onMouseDown={(e) => {e.preventDefault(); props.handleClick(item)}}>
                            <CustomOption {...item} 
                                extraClasses={props.extraClasses + (props.selectedLinks && props.selectedLinks.map(link => link.value).includes(item.value)? ' quote-static': '')}
                            />
                        </div>)
                        
                })
            }
            <div className='' hidden={!isEmpty(props.linkItems)}>
                <div className='d-flex justify-content-center'>
                    {props.emptyElement?? (
                        <div>
                            No Items.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default LinkCard;