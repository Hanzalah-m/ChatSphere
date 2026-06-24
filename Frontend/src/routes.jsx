import { memo } from 'react';
import {createBrowserRouter} from 'react-router-dom';
import Home from './auth/pages/home';
import Login from './auth/pages/login';
import Register from './auth/pages/register';
import Profile from './auth/pages/profile';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {  
        path: '/profile',
        element: <Profile />
    }
])

export default memo(router);