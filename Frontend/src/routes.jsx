import { memo } from 'react';
import {createBrowserRouter} from 'react-router-dom';
import Home from './auth/pages/home';
import Login from './auth/pages/login';
import Register from './auth/pages/register';
import Profile from './Home/page/profile';
import Dashboard from './Home/page/home';
import Protected from './auth/component/protected';
import PublicRoute from './auth/component/public';

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