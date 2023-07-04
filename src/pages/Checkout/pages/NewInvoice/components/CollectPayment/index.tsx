import { Heading, Button, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { IInvoice, ILineItem, PaymentMode } from "@src/models/IInvoice";
import { collectPayment, useAddInvoiceMutation, useSaveLineItemsMutation } from "@src/state/services/invoiceService";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import { useEffect, useState } from "react";

export default function CollectPayment() {
	const [paymentMode, setPaymentMode] = useState<PaymentMode>();
	const [paymentConplete, setPaymentConplete] = useState<boolean>(false);
	const [invoiceSaveRequest, setInvoiceSaveRequest] = useState<IInvoice>();
	const [addInvoice] = useAddInvoiceMutation();
	const [saveLineItems] = useSaveLineItemsMutation();
	const invoice = useAppSelector((s) => s.checkout.invoice.data);
	const lineItems = useAppSelector((s) => s.checkout.lineItems.data);

	const dispatch = useAppDispatch();
	const saveInvoice = async (invoice: IInvoice, lineItems: ILineItem[]) => {
		let savedInvoice = await addInvoice(invoice).unwrap();
		console.log("addInvoice result", savedInvoice);
		let updatedLineItems: ILineItem[] = lineItems.map((x) => ({
			...x,
			invoiceNumber: savedInvoice.number as number,
		}));
		let resultLineItems = await saveLineItems(updatedLineItems).unwrap();
		console.log("saveLineItems result", resultLineItems);
	};
	const onPaymentCollect = () => {
		if (!paymentMode || !invoice) return;
		dispatch(collectPayment(paymentMode));
		setInvoiceSaveRequest({
			...invoice,
			paid_by: paymentMode,
		});

		// setPaymentConplete(true);
	};
	useEffect(() => {
		if (!invoice) return;
		if (!invoice.paid_by) return;
		setPaymentMode(invoice.paid_by);
		setPaymentConplete(true);
	}, [invoice]);
	useEffect(() => {
		if (invoiceSaveRequest == undefined) return;
		saveInvoice(invoiceSaveRequest, lineItems);
	}, [invoiceSaveRequest]);
	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (paymentConplete) return;
					onPaymentCollect();
				}}
				style={{ maxWidth: "40rem", margin: "auto", marginTop: "5rem" }}
			>
				<Heading marginBottom={"4rem"}>Select Payment Mode</Heading>

				<RadioGroup onChange={(e) => setPaymentMode(e as PaymentMode)} value={paymentMode} style={{ marginBottom: "1rem" }}>
					<Stack>
						<Radio value={PaymentMode.CASH}>Cash</Radio>
						<Radio value={PaymentMode.CARD}>Debit Card/ Credit Card</Radio>
						<Radio value={PaymentMode.ONLINE}>Online</Radio>
						<Radio value={PaymentMode.UPI}>UPI / GPay / PhonePe</Radio>
					</Stack>
				</RadioGroup>
				<Button isDisabled={paymentConplete} type="submit" style={{ marginBottom: "1rem" }} bg={"cyan.400"}>
					Collect Payment
				</Button>
				{paymentConplete && <Heading>Payment Done</Heading>}
			</form>
		</>
	);
}
