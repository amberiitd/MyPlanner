import { FC } from 'react';
import CustomLink from '../CustomLink/CustomLink';
import './LinkCard.css';

interface LinkCardProps{

}

const LinkCard: FC<LinkCardProps> = (props) => {
    
    const customLinkItems = [
        {
            label: 'Given Label',
        },
        {
            label: 'Given Label',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
            actions: [
                {
                    label: 'favorite',
                    bsIcon: 'star',
                    flipBsIcon: 'star-fill',
                    handleClick: (event: any) => {}
                },
                {
                    label: 'view-later',
                    bsIcon: 'hourglass',
                    handleClick: (event: any) => {}
                }
            ]
        }
    ]
    return (
        <div className='w-100 shadow-sm'>
            {
                customLinkItems.map((item, index) => (
                    <CustomLink key ={`custom-link-${index}`} {...item}/>
                ))
            }
        </div>
    )
};

export default LinkCard;