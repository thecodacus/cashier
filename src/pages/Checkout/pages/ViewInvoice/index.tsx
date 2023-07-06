import { Heading } from "@chakra-ui/react";
import { ILineItem } from "@src/models/IInvoice";
import { getAllInvoiceLineItems, useGetInvoiceByNumberQuery } from "@src/state/services/invoiceService";
import { useAppDispatch } from "@src/state/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvoiceItems from "./components/InvoiceItems";
import { ICustomer } from "@src/models/ICustomer";
import { getCustomerById } from "@src/state/services/customerService";
import InvoiceDetails from "./components/InvoiceDetails";

export default function ViewInvoice() {
	let { number } = useParams();
	let { data: invoice, isLoading, isSuccess, isError, error } = useGetInvoiceByNumberQuery(parseInt(number as string));
	const [lineitems, setLineItems] = useState<ILineItem[]>([]);
	const [buyer, setBuyer] = useState<ICustomer>();
	const dispatch = useAppDispatch();
	const fetchInvoiceItems = async (invoiceNumber: number) => {
		console.log("Loading items for ", invoiceNumber);

		let result = await dispatch(getAllInvoiceLineItems.initiate(invoiceNumber)).unwrap();
		setLineItems(result);
	};
	const fetchBuyer = async (cid: number) => {
		let result = await dispatch(getCustomerById.initiate(cid)).unwrap();
		if (result) setBuyer(result);
	};
	useEffect(() => {
		if (isSuccess && invoice && invoice.number) {
			fetchInvoiceItems(invoice.number);
			fetchBuyer(invoice.buyer_id);
		}
	}, [isSuccess, invoice]);
	return (
		<div>
			{isLoading && (
				<>
					<Heading>Loading Invoice Please Wait...</Heading>
				</>
			)}
			{isSuccess && invoice && (
				<>
					<div style={{ width: "fit-content", minWidth: "20rem" }}>
						<InvoiceDetails invoice={invoice} buyer={buyer} />
					</div>

					<div style={{ width: "fit-content", minWidth: "20rem", marginTop: "1rem" }}>
						<InvoiceItems items={lineitems} />
					</div>
				</>
			)}
			{isError && (
				<>
					<Heading>{JSON.stringify(error)}</Heading>
				</>
			)}
		</div>
	);
}
