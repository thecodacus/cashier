import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/default";
import { RouterProvider } from "react-router-dom";
import router from "./setup/routes/AppRoutes";
import "./App.scss";

function App() {
	return (
		<ChakraProvider theme={theme}>
			<RouterProvider router={router}></RouterProvider>
		</ChakraProvider>
	);
}

export default App;
