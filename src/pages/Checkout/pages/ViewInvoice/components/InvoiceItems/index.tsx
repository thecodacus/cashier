import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { ILineItem } from "@src/models/IInvoice";

interface IProps {
	items: ILineItem[];
}
export default function InvoiceItems({ items }: IProps) {
	return (
		<Card>
			<CardHeader>
				<Heading size="md">Invoice Items</Heading>
			</CardHeader>

			<CardBody>
				<TableContainer>
					<Table variant="simple">
						{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
						<Thead>
							<Tr>
								<Th>#</Th>
								<Th>Code</Th>
								<Th>Name</Th>
								<Th>Item Price ₹</Th>
								<Th>Discount ₹</Th>
								<Th>Quantity</Th>
								<Th>Sub Total ₹</Th>
								<Th>Tax Rate (%)</Th>
								<Th>Tax ₹</Th>
								<Th>Total ₹</Th>
							</Tr>
						</Thead>
						<Tbody>
							{items.map((item, i) => {
								return (
									<Tr key={item.id}>
										<Td>{i + 1}</Td>
										<Td>{item.productCode}</Td>
										<Td isTruncated={true}>{item.name}</Td>
										<Td>{item.itemPrice}</Td>
										<Td>{item.discount}</Td>
										<Td>{item.quantity}</Td>
										<Td>{item.subtotal.toFixed(2)}</Td>
										<Td>{((item.cgst + item.sgst + item.igst) * 100).toFixed(2)}</Td>
										<Td>{((item.cgst + item.sgst + item.igst) * item.subtotal).toFixed(2)}</Td>
										<Td>{item.total.toFixed(2)}</Td>
									</Tr>
								);
							})}
						</Tbody>
						{/* <Tfoot>
					<Tr>
						<Th>To convert</Th>
						<Th>into</Th>
						<Th isNumeric>multiply by</Th>
					</Tr>
				</Tfoot> */}
					</Table>
				</TableContainer>
			</CardBody>
		</Card>
	);
}
