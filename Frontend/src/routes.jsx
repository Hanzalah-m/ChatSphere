import { memo } from 'react';
import {createBrowserRouter} from 'react-router-dom';
import Home from './feature/auth/pages/home';
import Login from './feature/auth/pages/login';
import Register from './feature/auth/pages/register';
import Profile from './feature/chat/pages/profile';
import Dashboard from './feature/chat/pages/home';
import Protected from './feature/auth/component/protected';
import PublicRoute from './feature/auth/component/public';

export const router = createBrowserRouter([
    {
        path: '/',
        element:<PublicRoute><Home /></PublicRoute> 
    },
    {
        path: '/login',
        element: <PublicRoute> <Login /></PublicRoute>
    },
    {
        path: '/register',
        element: <PublicRoute><Register /></PublicRoute>
    },
    {  
        path: '/profile',
        element:<Protected><Profile /></Protected> 
    },
    {
        path: '/dashboard',
        element:<Protected><Dashboard /></Protected> 
    }
])

export default memo(router);