import { Navigate, useLocation } from "react-router-dom";

interface SimpleNavigator {
    validate: () => boolean;
    defaultPath: string;
}
const DefaultRoute = (props: { element: JSX.Element }) => {
    const location = useLocation();
    const navigation: {
        [key: string]: SimpleNavigator;
    } = {
        '/login': {
            validate: () => {
                return true;
            },
            defaultPath: '/myp/home'
        }
    };

    const defaultNavigation: SimpleNavigator = {
        validate: () => {
            return true;
        },
        defaultPath: '/myp/home'
    };

    const pathNav = navigation[location.pathname] || defaultNavigation;
    return pathNav.validate()
        ? props.element
        : <Navigate to={pathNav.defaultPath} />
}

export default DefaultRoute;