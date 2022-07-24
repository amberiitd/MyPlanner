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
            value: 'givenLabel1',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
            
        },
        {
            label: 'Given Label',
            value: 'givenLabel2',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
            actions: [
                {
                    label: 'favorite',
                    value:'favorite',
                    bsIcon: 'star',
                    flipBsIcon: 'star-fill',
                    handleClick: (event: any) => {}
                },
                {
                    label: 'view-later',
                    value:'favorite',
                    bsIcon: 'hourglass',
                    handleClick: (event: any) => {}
                }
            ]
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
                    handleClick={(event: any) => {}}
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
                    handleClick={(event: any) => {}}
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