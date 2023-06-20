import { Heading, FormControl, FormLabel, Input, Button, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { PaymentMode } from "@src/models/IInvoice";
import { collectPayment } from "@src/state/services/invoiceService";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import React, { useEffect, useState } from "react";

export default function CollectPayment() {
	const [paymentMode, setPaymentMode] = useState<PaymentMode>();
	const [paymentConplete, setPaymentConplete] = useState<boolean>(false);
	const invoice = useAppSelector((s) => s.checkout.invoice.data);

	const dispatch = useAppDispatch();
	const onPaymentCollect = () => {
		if (!paymentMode) return;
		dispatch(collectPayment(paymentMode));
		setPaymentConplete(true);
	};
	useEffect(() => {
		if (!invoice) return;
		if (!invoice.paid_by) return;
		setPaymentMode(invoice.paid_by);
		setPaymentConplete(true);
	}, [invoice]);
	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (paymentConplete) return;
					onPaymentCollect();
				}}
				style={{ maxWidth: "20rem", margin: "auto", marginTop: "5rem" }}
			>
				<Heading marginBottom={"4rem"}>Payment</Heading>
				<RadioGroup onChange={(e) => setPaymentMode(e as PaymentMode)} value={paymentMode}>
					<Stack direction="row">
						<Radio value={PaymentMode.CASH}>Cash</Radio>
						<Radio value={PaymentMode.CARD}>Debit Card/ Credit Card</Radio>
						<Radio value={PaymentMode.ONLINE}>Online</Radio>
						<Radio value={PaymentMode.UPI}>Upi/Gpay/PhonePe</Radio>
					</Stack>
				</RadioGroup>
				<Button isDisabled={paymentConplete} type="submit">
					Collect Payment
				</Button>
				{paymentConplete && <Heading>Payment Done</Heading>}
			</form>
		</>
	);
}
