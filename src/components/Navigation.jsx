import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import '../assets/css/navigation.css'

const navigation = [
    {
        navigationName: 'Group Chat',
        path: '/groupchat'
    },
    {
        navigationName: 'Manage Users',
        path: '/users'
    },
    {
        navigationName: 'Manage Documents',
        path: '/documents'
    },
    {
        navigationName: 'Logout',
        path: '/logout'
    }
];

const Navigation = () => {
    const [activeNavItem, setActiveNavItem] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/edituser')) {
            setActiveNavItem('Manage Users');
        } else {
            setActiveNavItem(null);
        }

        if (path.includes('/share')) {
            setActiveNavItem('Manage Documents');
        } else {
            setActiveNavItem(null);
        }
    }, [location]);

    const handleNavigationClick = (navigationName) => {
        setActiveNavItem(navigationName);
    }

    return (
        //returning the main structure of the page with all the functionality needed
        <div className="nav-container">
            <nav className="nav-bar">
                <ul>
                    {navigation.map(item => (
                        <li key={item.navigationName}>
                            <NavLink 
                                to={item.path} 
                                onClick={() => handleNavigationClick(item.navigationName)}
                                className={`nav ${activeNavItem === item.navigationName ? 'active' : null}`}
                            >
                                {item.navigationName}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;
