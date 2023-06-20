import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import InvoiceHistory from "./components/InvoiceHistory";
import { newCheckout, useGetAllInvoicesQuery } from "@src/state/services/invoiceService";
import { useAppDispatch } from "@src/state/store";

export default function Checkout() {
	const navigate = useNavigate();
	const { data, isLoading } = useGetAllInvoicesQuery();
	const dispatch = useAppDispatch();

	return (
		<>
			<Flex flexDirection={"row-reverse"} mb={"2rem"}>
				<Button
					onClick={() => {
						dispatch(newCheckout());
						navigate("new");
					}}
				>
					New Checkout
				</Button>
			</Flex>
			{data && <InvoiceHistory items={data} />}
			{(!data || data.length == 0) && !isLoading && <Heading>No Invoice Available</Heading>}
		</>
	);
}
