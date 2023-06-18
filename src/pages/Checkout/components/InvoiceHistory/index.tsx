import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, IconButton } from "@chakra-ui/react";
import { IInvoice } from "@src/models/IInvoice";
import { FaPaste } from "react-icons/fa";

interface IProps {
	items: IInvoice[];
}
export default function InvoiceHistory({ items }: IProps) {
	return (
		<TableContainer>
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
				{(!items || items.length > 0) && <TableCaption>Invoice List</TableCaption>}
				<Thead width={"full"}>
					<Tr>
						<Th>Invoice Number</Th>
						<Th>Date</Th>
						<Th isNumeric>Buyer Phone</Th>
						<Th isNumeric>Sub Total</Th>
						<Th isNumeric>Tax</Th>
						<Th isNumeric>Total</Th>
						<Th isNumeric>Payment Mode</Th>
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
								<Td isTruncated>{item.buyer_id}</Td>
								<Td isTruncated>{item.cgst + item.sgst + item.igst}</Td>
								<Td isTruncated>{item.total}</Td>
								<Td isTruncated>{item.paid_by || "Not Paid"}</Td>
								<Td style={{ width: "1%" }}>
									<IconButton aria-label="view item" icon={FaPaste} />
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
