import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";
import { ICustomer } from "@src/models/ICustomer";
import { IInvoice } from "@src/models/IInvoice";

interface IProps {
	invoice: IInvoice;
	buyer: ICustomer | undefined;
}
export default function InvoiceDetails({ invoice, buyer }: IProps) {
	return (
		<Card>
			<CardHeader>
				<Heading size="md">Invoice Details</Heading>
			</CardHeader>

			<CardBody>
				<Stack spacing="4">
					<Box textAlign={"left"} display={"flex"} gap={2}>
						<Heading size="xs" textTransform="uppercase">
							Invoice Number:
						</Heading>
						<Text fontSize="sm" lineHeight={1.2}>
							{invoice.number}
						</Text>
					</Box>
					<Box textAlign={"left"} display={"flex"} gap={2}>
						<Heading size="xs" textTransform="uppercase">
							Buyer Name:
						</Heading>
						<Text fontSize="sm" lineHeight={1.2}>
							{buyer?.name || "N/A"}
						</Text>
					</Box>
					<Box textAlign={"left"} display={"flex"} gap={2}>
						<Heading size="xs" textTransform="uppercase">
							Total Price:
						</Heading>
						<Text fontSize="sm" lineHeight={1.2}>
							₹{invoice.total.toFixed(2)}
						</Text>
					</Box>
					<Box textAlign={"left"} display={"flex"} gap={2}>
						<Heading size="xs" textTransform="uppercase">
							Payment Mode:
						</Heading>
						<Text fontSize="sm" lineHeight={1.2}>
							{invoice.paid_by}
						</Text>
					</Box>
				</Stack>
			</CardBody>
		</Card>
	);
}
