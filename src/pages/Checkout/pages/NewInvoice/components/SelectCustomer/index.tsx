import { FormControl, FormLabel, Input, Heading, Button } from "@chakra-ui/react";
import { ICustomer } from "@src/models/ICustomer";
import { getCustomerById, useAddCustomerMutation } from "@src/state/services/customerService";
import { setBuyer } from "@src/state/services/invoiceService";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import { useEffect, useState } from "react";

interface IProps {
	buyer: ICustomer | null;
}
export default function SelectCustomer({ buyer }: IProps) {
	const [phone, setPhone] = useState<number | undefined>(buyer?.phone || undefined);
	const [name, setName] = useState<string>(buyer?.name || "");
	const [isNew, setIsNew] = useState<boolean>(false);
	const [addCustomer] = useAddCustomerMutation();
	const dispatch = useAppDispatch();
	const onPhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			let value = parseInt(e.target.value);
			setPhone(value);
		} catch (error) {
			console.log(error);
		}
	};
	const onNewCustomer = async () => {
		if (!phone) return;
		let customer: ICustomer = {
			phone,
			name,
		};
		let response = await addCustomer(customer).unwrap();
		if (response) dispatch(setBuyer(customer));
	};

	useEffect(() => {
		if (`${phone}`.length != 10) {
			dispatch(setBuyer(null));
			setIsNew(false);
			return;
		}
		if (!phone) return;
		if (phone == buyer?.phone) return;
		dispatch(getCustomerById.initiate(phone))
			.unwrap()
			.then((result) => {
				if (result) {
					setName(result.name);
					dispatch(setBuyer(result));
				} else {
					setName("");
					setIsNew(true);
				}
			});
	}, [phone]);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onNewCustomer();
			}}
			style={{ maxWidth: "20rem", margin: "auto", marginTop: "5rem" }}
		>
			<Heading marginBottom={"4rem"}>Select Customer</Heading>
			<FormControl isRequired>
				<FormLabel>Phone Number</FormLabel>
				<Input onChange={onPhoneChange} type="tel" pattern="^\d{10}$" value={phone || ""} placeholder="Phone" name="phone" marginBottom={"1rem"} />
				{/* <NumberInput pattern="^\d*$" step={1} name="phone" max={500} min={0}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput> */}
				<FormControl isRequired>
					<FormLabel>Name</FormLabel>
					<Input disabled={!isNew} placeholder="Name" name="name" value={name} onChange={(e) => setName(`${e.target.value}`)} />
				</FormControl>
			</FormControl>
			{isNew && (
				<Button type="submit" marginTop={"1rem"}>
					Add New Customer
				</Button>
			)}
		</form>
	);
}
