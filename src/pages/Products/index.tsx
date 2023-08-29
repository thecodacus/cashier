import { useGetAllProductsQuery } from "@src/state/services/productService";
import ProductList from "./components/ProductList";
import { Flex } from "@chakra-ui/react";
import AddProduct from "./components/AddProduct";

export default function Products() {
	const { data } = useGetAllProductsQuery();
	return (
		<>
			<Flex flexDirection={"row-reverse"} mb={"2rem"}>
				<AddProduct />
			</Flex>

			{data && <ProductList items={data} />}
		</>
	);
}
