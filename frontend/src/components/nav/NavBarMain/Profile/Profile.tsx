import { Auth, container } from 'aws-amplify';
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../../app/store';
import ButtonCircle from '../../../ButtonCircle/ButtonCircle';
import LinkCard from '../../../LinkCard/LinkCard';
import { AuthContext } from '../../../route/AuthGuardRoute';
import './Profile.css';

const Profile: FC =()=>{
    const {authUser} = useContext(AuthContext);
    const user = useMemo(()=> ({
        fullName: (authUser.data.attributes['custom:fullName'] || '') as string,
        email: (authUser.data.attributes.email || '') as string
    }), [ authUser]);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const handleClickOption = (item: any) => {
        if (item.value === 'logout'){
            Auth.signOut()
            .then(res => {
                console.log(res);
                navigate('/login');
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
    useEffect(() =>{
        const handleClick = (e: any) => {
            if(dropdownRef.current && dropdownRef.current.contains(e.target)){

            }else{
                setDropdown(false);
            }
        }
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])
    return (
        <div ref={dropdownRef} className='dropdown d-flex align-items-center h-100'>
            <div className=''>
                <ButtonCircle 
                    label={user?.fullName.split(' ').slice(0, 2).map(p => p[0]).join('') || 'P'} 
                    showLabel={true}
                    bsIcon={'person-fill'}
                    size='sm-2'
                    onClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div className={`dropdown-menu bg-light py-1 ${dropdown ? 'show': ''}`} style={{width: '20em', top: '3em', right: 0}}>
                <div className='custom-padding bg-white mb-1' style={{}}>
                    <div className='bold-md'>
                        Account
                    </div>
                    <div className='d-flex align-items-center py-2'>
                        <ButtonCircle 
                            label={user?.fullName.split(' ').slice(0, 2).map(p => p[0]).join('') || 'P'} 
                            showLabel={true}
                            bsIcon={'person-fill'}
                            size='md-1'
                            disabled
                            style={{cursor: 'default'}}
                            onClick={()=>{}}
                        />
                        <div className='ms-2'>
                            <div>
                                {user?.fullName}
                            </div>
                            <div className='text-muted f-80'>
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white'>
                    <LinkCard 
                        label={''} 
                        showLabel={false} 
                        isLoading={false} 
                        linkItems={[
                            {
                                label: 'Logout',
                                value: 'logout'
                            }
                        ]} 
                        handleClick={handleClickOption}
                    />
                </div>
                
            </div>
        </div>
    )
}

export default Profile;