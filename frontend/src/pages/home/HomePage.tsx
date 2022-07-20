import { FC } from 'react';
import NavBarMain from '../../components/nav/NavBarMain/NavBarMain';
import './HomePage.css';

interface HomePageProps{

}

const HomePage: FC<HomePageProps> = (props) => {

    return (
        <div className='container-fluid font-theme p-0 m-0'>
            <NavBarMain />
        </div>
    )
}

export default HomePage;