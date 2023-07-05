import { Box, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IProduct } from "@src/models/IProduct";
import EditProduct from "../EditProduct";

interface IProps {
	items: IProduct[];
}
export default function ProductList({ items }: IProps) {
	return (
		<TableContainer maxHeight={"calc( 70vh - 100px)"} overflowY={"auto"}>
			<Table
				// display="inline-block"
				// border="2px solid"
				// borderColor="gray.600"
				// borderRadius="md"
				// rounded="20px"

				rounded="md"
				variant="striped"
				colorScheme="teal"
				width={"full"}
				size="md"
			>
				<TableCaption>Product List</TableCaption>
				<Thead width={"full"}>
					<Tr position={"sticky"} top={0} bg={"gray.900"}>
						<Th>Product Code</Th>
						<Th>Name</Th>
						<Th>Category</Th>
						<Th isNumeric>Buying Price</Th>
						<Th isNumeric>Selling Price</Th>
						<Th isNumeric>Available</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody maxHeight={"70vh"}>
					{items.map((item) => {
						return (
							<Tr rounded="md" key={item.code} borderRadius={"md"}>
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
