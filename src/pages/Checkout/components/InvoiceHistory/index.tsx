import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, IconButton } from "@chakra-ui/react";
import { IInvoice } from "@src/models/IInvoice";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface IProps {
	items: IInvoice[];
}
export default function InvoiceHistory({ items }: IProps) {
	let navigator = useNavigate();
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
				colorScheme="cyan"
				width={"full"}
				size="md"
			>
				{(!items || items.length > 0) && <TableCaption>Invoice List</TableCaption>}
				<Thead width={"full"}>
					<Tr position={"sticky"} top={0} bg={"gray.900"}>
						<Th>Invoice Number</Th>
						<Th>Date</Th>
						<Th>Buyer Phone</Th>
						<Th isNumeric>Sub Total</Th>
						<Th isNumeric>Tax</Th>
						<Th isNumeric>Total</Th>
						<Th>Payment Mode</Th>
						{/* <Th isNumeric>Profit</Th> */}
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{items.map((item) => {
						return (
							<Tr rounded="md" key={item.number} borderRadius={"md"}>
								<Td isTruncated>{item.number}</Td>
								<Td isTruncated>{new Date(item.date).toLocaleString()}</Td>
								<Td>{item.buyer_id}</Td>
								<Td isNumeric>{item.subtotal.toFixed(2)}</Td>
								<Td isNumeric>{(item.cgst + item.sgst + item.igst).toFixed(2)}</Td>
								<Td isNumeric>{item.total.toFixed(2)}</Td>
								<Td>{item.paid_by || "Not Paid"}</Td>
								<Td style={{ width: "1%" }}>
									<IconButton onClick={() => navigator(`${item.number}`)} aria-label="view item" icon={<FaEye />} />
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
