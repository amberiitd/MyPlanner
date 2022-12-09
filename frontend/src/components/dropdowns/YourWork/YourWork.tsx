import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../../LinkCard/LinkCard';
import { NavDropDownContext } from '../../nav/NavBarLink/NavBarLink';
import TabbedCard from '../../Tabbedcard/TabbedCard';
import './YourWork.css';

interface YourWorkProps{

}

const YourWork: FC<YourWorkProps> = () => {
    const {setDropdown} = useContext(NavDropDownContext);
    const navigate = useNavigate();
    const handleClickOption = (item: any) => {
        setDropdown(false);
    }
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
                    handleClick={handleClickOption}
                />
            ),
            footerElement: (
                <LinkCard 
                    label='footer1'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'Go to Your Work Page',
                            value: 'go-to-your-work-page',
                            href: '/myp/your-work'
                        }
                    ]}
                    handleClick={handleClickOption}
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