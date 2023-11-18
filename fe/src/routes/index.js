import Login from '../Pages/Login';
import Home from '../Pages/Home'
import Profile from '../Pages/Profile';
const publicRoutes = [
	{ path: '/login', page: Login, layout: null },
	{ path: '/', page: Home },
	{ path: '/profile', page: Profile }
]

export { publicRoutes };