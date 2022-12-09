import { env } from 'process';
import { FC } from 'react';
import './NavBrand.css';

interface NavBrandProps{

}
const NavBrand: FC<NavBrandProps> = (props) => {

    return (
        <div className='brand d-inline-flex m-1 rounded-2'>
            <div className='m-2'>
                <img className='brand-img' src={`${process.env.PUBLIC_URL}/logo.svg`} width="40" alt="MyP" />
            </div>
            <div className="d-none d-lg-block h4 m-2 brand-name">MyPlanner</div>
        </div>
    );
}

export default NavBrand;