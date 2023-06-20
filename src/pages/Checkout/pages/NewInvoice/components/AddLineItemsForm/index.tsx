import { Heading, FormControl, FormLabel, Input, Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { ILineItem } from "@src/models/IInvoice";
import { IProduct } from "@src/models/IProduct";
import { addLineItem, updateLineItem } from "@src/state/services/invoiceService";
import { getProductByCode } from "@src/state/services/productService";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import { useEffect, useRef, useState } from "react";

export default function AddLineItemsForm() {
	const lineItems = useAppSelector((s) => s.checkout.lineItems);
	const invoice = useAppSelector((s) => s.checkout.invoice);
	const [itemCode, setItemCode] = useState<IProduct["code"] | undefined>();
	const [updateQuantityRequest, setUpdateQuantityRequest] = useState<{ item: ILineItem; quantity: number } | undefined>();
	const inputBox = useRef<HTMLInputElement>(null);
	const dispatch = useAppDispatch();
	const onGenerateInvoice = () => {};

	const calculateLineValues = (product: IProduct, quantity: number = 1, discount: number = 0, cgstRate: number = 0.09, sgstRate: number = 0.09, igstRate: number = 0.0): ILineItem => {
		let productCode = product.code || "";
		let invoiceNumber = invoice.data?.number || 0;
		let itemPrice = product.sellingPrice;
		let name = product.name;
		let subtotal = (product.sellingPrice - discount) * quantity;
		let cgst = subtotal * cgstRate;
		let sgst = subtotal * sgstRate;
		let igst = subtotal * igstRate;
		let profit = subtotal - product.buyingPrice;
		let total = subtotal + cgst + sgst + igst;
		return {
			productCode,
			invoiceNumber,
			itemPrice,
			name,
			quantity,
			discount,
			subtotal,
			cgst,
			sgst,
			igst,
			profit,
			total,
		};
	};
	const updateQuantity = async (item: ILineItem, quantity: number) => {
		let product = await dispatch(getProductByCode.initiate(item.productCode)).unwrap();
		if (product) {
			let newItem = calculateLineValues(product, quantity);
			newItem.id = item.id;
			dispatch(updateLineItem(newItem));
		}
	};
	useEffect(() => {
		if (!updateQuantityRequest) return;
		updateQuantity(updateQuantityRequest.item, updateQuantityRequest.quantity).then((result) => {
			console.log(result);
		});
	}, [updateQuantityRequest]);
	useEffect(() => {
		if (itemCode == undefined) return;
		if (invoice.data == null) return;
		if (`${itemCode}`.trim().length == 0) return;

		dispatch(getProductByCode.initiate(itemCode))
			.unwrap()
			.then((product) => {
				if (product) {
					let foundExisting = lineItems.data.find((i) => i.productCode == itemCode);
					if (foundExisting) {
						let newItem = calculateLineValues(product, foundExisting.quantity + 1);
						newItem.id = foundExisting.id;
						dispatch(updateLineItem(newItem));
						if (inputBox.current) {
							inputBox.current.value = "";
						}
						return;
					}
					let newItem = calculateLineValues(product, 1);
					newItem.id = Date.now();
					dispatch(addLineItem(newItem));
					if (inputBox.current) {
						inputBox.current.value = "";
					}
				}
			});
	}, [itemCode]);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onGenerateInvoice();
			}}
			style={{ margin: "auto", marginTop: "5rem" }}
		>
			{/* <Heading marginBottom={"4rem"}>Select Customer</Heading> */}
			<TableContainer>
				<Table size="sm">
					<Thead>
						<Tr>
							<Th>SN</Th>
							<Th>Code</Th>
							<Th>Name</Th>
							<Th>Item Price</Th>
							<Th>discount</Th>
							<Th>Quantity</Th>
							<Th>Sub Total</Th>
							<Th>Tax</Th>
							<Th>Total</Th>
						</Tr>
					</Thead>
					<Tbody>
						{lineItems.data.map((item, i) => {
							return (
								<Tr key={item.id}>
									<Td>{i + 1}</Td>
									<Td>{item.productCode}</Td>
									<Td isTruncated={true}>{item.name}</Td>
									<Td>{item.itemPrice}</Td>
									<Td>{item.discount}</Td>
									<Td>
										<Input
											type="number"
											value={item.quantity}
											width={"5rem"}
											onChange={(e) => {
												try {
													let quantity = parseInt(e.target.value);
													setUpdateQuantityRequest({ item, quantity });
												} catch (error) {
													console.log(error);
												}
											}}
										/>
									</Td>
									<Td>{item.subtotal}</Td>
									<Td>{item.cgst + item.sgst + item.igst}</Td>
									<Td>{item.total}</Td>
								</Tr>
							);
						})}
						<Tr>
							<Td>{lineItems.data.length + 1}</Td>
							<Td>
								<Input
									ref={inputBox}
									width={"10rem"}
									type="text"
									onChange={(e) => {
										setItemCode(e.target.value);
									}}
								/>
							</Td>
							<Td isTruncated={true}></Td>
							<Td></Td>
							<Td></Td>
							<Td></Td>
							<Td></Td>
							<Td></Td>
							<Td></Td>
						</Tr>
					</Tbody>
					<Tfoot>
						{/* <Tr>
							<Th>To convert</Th>
							<Th>into</Th>
							<Th isNumeric>multiply by</Th>
						</Tr> */}
					</Tfoot>
				</Table>
			</TableContainer>
			{/* Invoice data */}
			<TableContainer>
				<Table size="sm">
					<Thead>
						<Tr>
							<Th>Order Number</Th>
							<Th>Customer ID</Th>
							<Th isNumeric>Sub Total</Th>
							<Th isNumeric>CGST</Th>
							<Th isNumeric>SGST</Th>
							<Th isNumeric>IGST</Th>
							<Th isNumeric>Total</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td>{invoice.data?.number}</Td>
							<Td>{invoice.data?.buyer_id}</Td>
							<Td isNumeric>{invoice.data?.subtotal}</Td>
							<Td isNumeric>{invoice.data?.cgst}</Td>
							<Td isNumeric>{invoice.data?.sgst}</Td>
							<Td isNumeric>{invoice.data?.igst}</Td>
							<Td isNumeric>{invoice.data?.total}</Td>
						</Tr>
					</Tbody>
					<Tfoot></Tfoot>
				</Table>
			</TableContainer>
		</form>
	);
}
