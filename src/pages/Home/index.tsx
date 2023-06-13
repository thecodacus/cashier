import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useGetAllProductsQuery, useSaveProductMutation } from "../../state/services/productService";

export default function Home() {
	const [count, setCount] = useState(0);
	const { data } = useGetAllProductsQuery();
	const [saveProduct] = useSaveProductMutation();
	useEffect(() => {
		saveProduct({
			code: "test",
			name: "test",
			category: "test",
			price: 123,
			quantity: 0,
		})
			.unwrap() // Unwrap the result to access the successful response
			.then((product) => {
				// Handle success
				console.log("Product created:", product);
			})
			.catch((error) => {
				// Handle error
				console.error("Product creation failed:", error);
			});
	}, []);
	return (
		<>
			<div>{JSON.stringify(data)}</div>
			<h1>Vite + React</h1>
			<div className="card">
				<Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}
