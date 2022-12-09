import { FC, useState } from 'react';
import NavBarTool from '../NavBarTool/NavBarTool';
import './NavSearch.css';

interface NavSearchProps{

}
const NavSearch: FC<NavSearchProps> = (props) => {
    const [showCollapsedSearch, setShowCollapsedSearch] = useState(false);
    const navSearchInput = (
        <input className='form-control-search navsearchinput border-0' type="text" placeholder='Search...' />
    );
    
    return(
        <div className='d-inline-flex h-100 w-100 font-thm'>
            <div className='d-block d-md-none ms-auto position-relative'>
                <div className='d-flex h-100 align-items-center' hidden={showCollapsedSearch} onClick={()=>{setShowCollapsedSearch(true)}}>
                    <NavBarTool item={{
                        label: 'search',
                        bsIcon: 'search'
                    }}/>
                </div>
                <div className={`collapse ${showCollapsedSearch? 'show': ''} collapseSearch shadow-sm border rounded-pill position-absolute ps-3`}>
                    <div className='d-inline-flex h-100 w-100 align-items-center'>
                        {navSearchInput}
                        <div className='' onClick={()=>{setShowCollapsedSearch(false)}}>
                            <NavBarTool item={{
                                label: 'search',
                                bsIcon: 'arrow-right'
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-none d-md-block ms-auto'>
                <div className='d-none h-100 d-md-inline-flex align-items-center'>
                    <div className='d-inline-flex border rounded-pill align-items-center pe-3 '>
                        <NavBarTool item={{
                            label: 'search',
                            bsIcon: 'search'
                        }}/>
                        {navSearchInput}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default NavSearch;