import { Auth } from 'aws-amplify';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../../../LinkCard/LinkCard';
import './Profile.css';

const Profile: FC =()=>{
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
    return (
        <div>
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
    )
}

export default Profile;