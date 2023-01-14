import { isEmpty } from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NotificationProps } from "../../app/slices/globalStateSlice";
import { RootState } from "../../app/store";
import SlideOverlay from "../SlideOverlay/SlideOverlay";

interface AppNotificationProps{
    retention?: number; 
}

const AppNotification: FC<AppNotificationProps> = (props) =>{
    const globalState = useSelector((state: RootState) => state.globalState);
    const [notification, setNotification] = useState<NotificationProps>(globalState.notification);
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);

    useEffect(() =>{
        if (globalState.notification.show 
            && !isEmpty(globalState.notification.id)
            && globalState.notification.id != notification.id
        ){
            if (notification.show){
                setNotification({...notification, show: false});
                setTimeout(() => {
                    setNotification(globalState.notification);
                }, props.retention || 600)
            }else{
                setNotification(globalState.notification);
            }
        }
    }, [globalState.notification])

    useEffect(() =>{
        if (timer) clearTimeout(timer);
        if (notification.show){
            setTimer(setTimeout(()=>{
                setNotification({...notification, show: false});
            }, props.retention || 5000))
        }
    }, [notification])

    return (
        <div>
            <SlideOverlay
                show={notification.show} 
                onToggle={()=> {setNotification({...notification, show: false})}}
            >
                {notification.text || (notification.render? notification.render(): 'Notification message')}
            </SlideOverlay>
        </div>
    )
}

export default AppNotification;