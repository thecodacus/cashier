import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, CardBody, CardHeader, Heading, Card } from "@chakra-ui/react";
interface IProps {
	header: string;
	items: { id: number; customerName: string; orderDate: Date; amount: number }[];
}
export function RecentCustomersTable({ items, header }: IProps) {
	return (
		<Card height={"100%"}>
			<CardHeader>
				<Heading fontSize={"xs"}>{header}</Heading>
			</CardHeader>
			<CardBody>
				<TableContainer>
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Customer</Th>
								<Th isNumeric>Order Total</Th>
							</Tr>
						</Thead>
						<Tbody>
							{items.map((order) => (
								<Tr key={order.id}>
									<Td>{order.customerName}</Td>
									<Td isNumeric>₹{order.amount}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</CardBody>
		</Card>
	);
}
