// import AdminPage from "../pages/AdminPage/AdminPage";
// import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import BookManagement from "../components/BookManagement/BookManagement";
import BorrowManagement from "../components/BorrowManagement/BorrowManagement";
import UserManagement from "../components/UserManagement/UserManagement";
import HomePage from "../pages/HomePage/HomePage";
// import MyOrder from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
// import OrderPage from "../pages/OrderPage/OrderPage";
// import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
// import PaymentPage from "../pages/PaymentPage/PaymentPage";
// import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
// import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
// import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
	{
		path: '/',
		page: HomePage,
		isShowHeader: true
	},
	// {
	//     path: '/order',
	//     page: OrderPage,
	//     isShowHeader: true
	// },
	// {
	//     path: '/my-order',
	//     page: MyOrder,
	//     isShowHeader: true
	// },
	// {
	//     path: '/details-order/:id',
	//     page: DetailsOrderPage,
	//     isShowHeader: true
	// },
	// {
	//     path: '/payment',
	//     page: PaymentPage,
	//     isShowHeader: true
	// },
	// {
	//     path: '/orderSuccess',
	//     page: OrderSuccess,
	//     isShowHeader: true
	// },
	// {
	//     path: '/products',
	//     page: ProductsPage,
	//     isShowHeader: true
	// },
	{
	    path: '/user',
	    page: UserManagement,
	    isShowHeader: true
	},
	{
	    path: '/book',
	    page: BookManagement,
	    isShowHeader: true
	},
	{
	    path: '/borrow',
	    page: BorrowManagement,
	    isShowHeader: true
	},
	{
		path: '/profile',
		page: ProfilePage,
		isShowHeader: true
	},
	{
		path: '/sign-in',
		page: SignInPage,
		isShowHeader: false
	},
	{
		path: '/sign-up',
		page: SignUpPage,
		isShowHeader: false
	},
	{
		path: '*',
		page: NotFoundPage
	}
]