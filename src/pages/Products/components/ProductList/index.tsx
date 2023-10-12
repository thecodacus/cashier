import { Input, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IProduct } from "@src/models/IProduct";
import EditProduct from "../EditProduct";
import { useEffect, useState } from "react";

interface IProps {
	items: IProduct[];
}
export default function ProductList({ items }: IProps) {
	const [filteredProducts, setFilteredProducts] = useState<IProduct[]>(items);
	const [codeFilter, setCodeFilter] = useState<string>("");
	const [nameFilter, setNameFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");

	useEffect(() => {
		let filtered = items
			.filter((product) => product.code?.toLocaleLowerCase()?.startsWith(codeFilter?.toLocaleLowerCase()))
			.filter((product) => product.name?.toLocaleLowerCase()?.startsWith(nameFilter?.toLocaleLowerCase()))
			.filter((product) => product.category?.toLocaleLowerCase()?.startsWith(categoryFilter?.toLocaleLowerCase()));
		setFilteredProducts(filtered);
	}, [nameFilter, codeFilter, categoryFilter, items]);

	return (
		<TableContainer maxHeight={"calc( 100vh - 250px)"} overflowY={"auto"}>
			<Table
				// display="inline-block"
				// border="2px solid"
				// borderColor="gray.600"
				// borderRadius="md"
				// rounded="20px"

				rounded="md"
				variant="striped"
				colorScheme="cyan"
				width={"full"}
				size="md"
			>
				<TableCaption>Product List</TableCaption>
				<Thead style={{ zIndex: 100 }} position={"sticky"} width={"full"}>
					<Tr position={"sticky"} top={0} bg={"gray.900"}>
						<Th width={"min-content"}>Serial</Th>
						<Th width={"min-content"}>Product Code</Th>
						<Th>Name</Th>
						<Th>Category</Th>
						<Th isNumeric>Buying Price</Th>
						<Th isNumeric>Selling Price</Th>
						<Th isNumeric>Available</Th>
						<Th></Th>
					</Tr>
					<Tr position={"sticky"} top={"2.5rem"} bg={"gray.900"}>
						<Th width={"20px"}></Th>
						<Th width={"min-content"}>
							<Input
								onChange={(e) => {
									setCodeFilter(`${e.currentTarget.value || ""}`);
								}}
								p={0}
								width={"auto"}
								name="code"
								type="text"
							/>
						</Th>
						<Th>
							<Input
								onChange={(e) => {
									setNameFilter(`${e.currentTarget.value || ""}`);
								}}
								p={0}
								width={"auto"}
								name="code"
								type="text"
							/>
						</Th>
						<Th>
							<Input
								onChange={(e) => {
									setCategoryFilter(`${e.currentTarget.value || ""}`);
								}}
								p={0}
								width={"auto"}
								name="code"
								type="text"
							/>
						</Th>
						<Th isNumeric></Th>
						<Th isNumeric></Th>
						<Th isNumeric></Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody maxHeight={"70vh"}>
					{filteredProducts.map((item, i) => {
						return (
							<Tr rounded="md" key={item.code} borderRadius={"md"}>
								<Td isTruncated>{i + 1}</Td>
								<Td isTruncated>{item.code}</Td>
								<Td isTruncated>{item.name}</Td>
								<Td>{item.category}</Td>
								<Td isNumeric>₹{item.buyingPrice.toFixed(2)}</Td>
								<Td isNumeric>₹{item.sellingPrice.toFixed(2)}</Td>
								<Td isNumeric>{item.quantity}</Td>
								<Td style={{ width: "1%" }}>
									<EditProduct product={item} />
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
