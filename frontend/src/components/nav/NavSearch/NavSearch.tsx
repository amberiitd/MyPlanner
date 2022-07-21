import { FC, useState } from 'react';
import NavBarTool from '../NavBarTool/NavBarTool';
import './NavSearch.css';

interface NavSearchProps{

}
const NavSearch: FC<NavSearchProps> = (props) => {
    const [showCollapsedSearch, setShowCollapsedSearch] = useState(false);
    const navSearchInput = (
        <input className='ps-2 form-control navsearchinput border-0' type="text" placeholder='Search...' />
    );
    
    return(
        <div className='d-inline-flex w-100'>
            <div className='d-block d-lg-none ms-auto'>
                <div className='' hidden={showCollapsedSearch} onClick={()=>{setShowCollapsedSearch(true)}}>
                    <NavBarTool label='search' bsIcon='search'/>
                </div>
            </div>
            
            <div className='input-group d-none d-lg-inline-flex border rounded-3 me-0'>
                <span className='btn input-group-text navsearchinput'>
                    <i className='bi bi-search'></i>
                </span>
                {navSearchInput}
            </div>
            <div className={`collapse ${showCollapsedSearch? 'show': ''} collapseSearch shadow-sm border rounded-3 position-absolute`}>
                <div className='d-inline-flex w-100'>
                    {navSearchInput}
                    <div className='' onClick={()=>{setShowCollapsedSearch(false)}}>
                        <NavBarTool label='search' bsIcon='arrow-right'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavSearch;