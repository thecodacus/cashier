import { Heading, FormControl, FormLabel, Input, Button, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { PaymentMode } from "@src/models/IInvoice";
import { collectPayment } from "@src/state/services/invoiceService";
import { useAppDispatch } from "@src/state/store";
import React, { useState } from "react";

export default function CollectPayment() {
	const [paymentMode, setPaymentMode] = useState<PaymentMode>();
	const [paymentConplete, setPaymentConplete] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const onPaymentCollect = () => {
		if (!paymentMode) return;
		dispatch(collectPayment(paymentMode));
		setPaymentConplete(true);
	};
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
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
			<Button type="submit">Collect</Button>
		</form>
	);
}
