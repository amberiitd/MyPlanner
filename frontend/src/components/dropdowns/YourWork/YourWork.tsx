import { FC } from 'react';
import LinkCard from '../../LinkCard/LinkCard';
import TabbedCard from '../../Tabbedcard/TabbedCard';
import './YourWork.css';

interface YourWorkProps{

}

const YourWork: FC<YourWorkProps> = () => {
    const assignedToMeLinks = [
        {
            label: 'Given Label',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
            handleClick: (event: any) => {},
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
            ],
            handleClick: (event: any) => {},
        }
    ]
    const tabs =[
        {
            label: 'Assigned to me',
            bodyElement: (
                <LinkCard 
                    label='Card Label'
                    showLabel={true}
                    isLoading={false}
                    linkItems={assignedToMeLinks}
                />
            ),
            footerElement: (
                <LinkCard 
                    label='footer1'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'Go to Your Work Page'
                        }
                    ]}
                />
            )
        },
        {
            label: 'Recent',
            bodyElement: (
                <div></div>
            )
        },
        {
            label: 'Boards',
            bodyElement: (
                <div></div>
            )
        },
    ];
    return (
        <div>
            <TabbedCard
                tabItems={tabs}
            />
        </div>
    )
}

export default YourWork;