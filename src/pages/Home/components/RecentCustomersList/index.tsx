import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, CardBody, CardHeader, Heading, Card } from "@chakra-ui/react";
import { useGetAllCustomersQuery } from "@src/state/services/customerService";
import { useGetAllInvoicesQuery } from "@src/state/services/invoiceService";
import { useEffect, useState } from "react";
interface IProps {
	header: string;
}
export function RecentCustomersTable({ header }: IProps) {
	const { data, isLoading } = useGetAllInvoicesQuery();
	const { data: cust, isLoading: isCustLoading } = useGetAllCustomersQuery();
	const [items, setItems] = useState<{ id: number; customerName: string; orderDate: Date; amount: number }[]>([]);
	useEffect(() => {
		if (!data) return setItems([]);
		let invs = [...data].reverse().slice(0, 10);
		setItems(
			invs.map((x) => ({
				id: x.buyer_id,
				customerName: `${cust?.find((c) => c.phone == x.buyer_id)?.name}`,
				orderDate: new Date(x.date),
				amount: x.total,
			}))
		);
	}, [data]);
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
							{isLoading || isCustLoading ? (
								<>
									<Tr>
										<Td>Loading...</Td>
									</Tr>
								</>
							) : (
								items.map((order) => (
									<Tr key={order.id}>
										<Td>{order.customerName}</Td>
										<Td isNumeric>₹{order.amount.toFixed(2)}</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</CardBody>
		</Card>
	);
}
