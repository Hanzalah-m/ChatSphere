import { memo } from 'react';
import {createBrowserRouter} from 'react-router-dom';
import Home from './auth/pages/home';
import Login from './auth/pages/login';
import Register from './auth/pages/register';
import Profile from './auth/pages/profile';
import Dashboard from './Home/page/home';
import Protected from './auth/component/protected';

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
    },
    {
        path: '/dashboard',
        element:<Protected><Dashboard /></Protected> 
    }
])

export default memo(router);