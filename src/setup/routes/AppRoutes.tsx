import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";
import PrivateLayout from "../../common/layouts/PrivateLayout";
import Products from "../../pages/Products";
import PublicLayout from "../../common/layouts/PublicLayout";
import Login from "../../pages/Auth/Login";
import Signup from "../../pages/Auth/SignUp";
import Checkout from "@src/pages/Checkout";
import NewInvoice from "@src/pages/Checkout/pages/NewInvoice";

export const router = createBrowserRouter([
	{
		path: "auth",
		element: <PublicLayout />,
		children: [
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "registar",
				element: <Signup />,
			},
		],
	},
	{
		path: "",
		element: <PrivateLayout />,
		children: [
			{
				path: "",
				element: <Home />,
				index: true,
			},
			{
				path: "products",
				element: <Products />,
			},
			{
				path: "checkouts",
				element: <Outlet />,
				children: [
					{
						path: "",
						index: true,
						element: <Checkout />,
					},
					{
						path: "new",
						element: <NewInvoice />,
					},
				],
			},
		],
	},
]);

export default router;
