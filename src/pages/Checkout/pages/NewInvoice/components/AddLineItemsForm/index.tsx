import { Card, CardBody, CardHeader, Heading, IconButton, Input, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { ILineItem } from "@src/models/IInvoice";
import { IProduct } from "@src/models/IProduct";
import { addLineItem, deleteLineItem, updateLineItem } from "@src/state/services/invoiceService";
import { getProductByCode } from "@src/state/services/productService";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";

export default function AddLineItemsForm() {
	const lineItems = useAppSelector((s) => s.checkout.lineItems);
	const invoice = useAppSelector((s) => s.checkout.invoice);
	const [itemCode, setItemCode] = useState<IProduct["code"] | undefined>();
	const [updateQuantityRequest, setUpdateQuantityRequest] = useState<{ item: ILineItem; quantity: number } | undefined>();
	const [updateTaxRequest, setUpdateTaxRequest] = useState<{ item: ILineItem; tax: number } | undefined>();
	const [updateDiscountRequest, setUpdateDiscountRequest] = useState<{ item: ILineItem; discount: number } | undefined>();
	const inputBox = useRef<HTMLInputElement>(null);
	const dispatch = useAppDispatch();
	const onGenerateInvoice = () => {};

	const calculateLineValues = ({ product, quantity = 1, discount = 0, cgstRate = 0.09, sgstRate = 0.09, igstRate = 0.0 }: { product: IProduct; quantity: number; discount: number; cgstRate: number; sgstRate: number; igstRate: number }): ILineItem => {
		let productCode = product.code || "";
		let invoiceNumber = invoice.data?.number || 0;
		let itemPrice = product.sellingPrice;
		let name = product.name;
		let subtotal = (product.sellingPrice - discount) * quantity;
		let cgst = cgstRate;
		let sgst = sgstRate;
		let igst = igstRate;
		let profit = subtotal - product.buyingPrice;
		let total = subtotal + subtotal * (cgst + sgst + igst);
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
	const getDefaultLineItemValues = (product: IProduct) => {
		let options: { product: IProduct; quantity: number; discount: number; cgstRate: number; sgstRate: number; igstRate: number } = { product, quantity: 1, discount: 0, cgstRate: 0.09, sgstRate: 0.09, igstRate: 0.0 };
		return options;
	};
	const updateQuantity = async (item: ILineItem, quantity: number) => {
		let product = await dispatch(getProductByCode.initiate(item.productCode)).unwrap();
		if (product) {
			let options = getDefaultLineItemValues(product);
			let newItem = calculateLineValues({
				...options,
				product,
				quantity,
				cgstRate: item.cgst,
				sgstRate: item.sgst,
				discount: item.discount,
			});
			newItem.id = item.id;
			dispatch(updateLineItem(newItem));
		}
	};
	const updateTax = async (item: ILineItem, tax: number) => {
		let product = await dispatch(getProductByCode.initiate(item.productCode)).unwrap();
		if (product) {
			let options = getDefaultLineItemValues(product);
			let newItem = calculateLineValues({
				...options,
				product,
				cgstRate: tax * 0.5,
				sgstRate: tax * 0.5,
				quantity: item.quantity,
				discount: item.discount,
			});
			newItem.id = item.id;
			return dispatch(updateLineItem(newItem));
		}
	};
	const updateDiscount = async (item: ILineItem, discount: number) => {
		let product = await dispatch(getProductByCode.initiate(item.productCode)).unwrap();
		if (product) {
			let options = getDefaultLineItemValues(product);
			let newItem = calculateLineValues({
				...options,
				product,
				discount,
				quantity: item.quantity,
				cgstRate: item.cgst,
				sgstRate: item.sgst,
			});
			newItem.id = item.id;
			return dispatch(updateLineItem(newItem));
		}
	};
	useEffect(() => {
		if (!updateDiscountRequest) return;
		updateDiscount(updateDiscountRequest.item, updateDiscountRequest.discount).then((result) => {
			console.log(result);
		});
	}, [updateDiscountRequest]);

	useEffect(() => {
		if (!updateTaxRequest) return;
		updateTax(updateTaxRequest.item, updateTaxRequest.tax).then((result) => {
			console.log(result);
		});
	}, [updateTaxRequest]);

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
		let code = itemCode;
		dispatch(getProductByCode.initiate(itemCode))
			.unwrap()
			.then((product) => {
				console.log(product);

				if (product) {
					let item = lineItems.data.find((i) => i.productCode == code);
					if (item) {
						let options = getDefaultLineItemValues(product);
						let newItem = calculateLineValues({
							...options,
							quantity: item.quantity + 1,
							discount: item.discount,
							cgstRate: item.cgst,
							sgstRate: item.sgst,
						});
						newItem.id = item.id;
						dispatch(updateLineItem(newItem));
						if (inputBox.current) {
							inputBox.current.value = "";
						}
						return;
					}
					let options = getDefaultLineItemValues(product);
					let newItem = calculateLineValues(options);

					newItem.id = Date.now();
					dispatch(addLineItem(newItem));
					if (inputBox.current) {
						inputBox.current.value = "";
					}
				}
			})
			.then(() => setItemCode(undefined));
	}, [itemCode]);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onGenerateInvoice();
			}}
			style={{ margin: "auto", marginTop: "1rem" }}
		>
			<Card minWidth="40rem" margin={"auto"}>
				<CardHeader>
					<Heading size="md">Invoice Details</Heading>
				</CardHeader>

				<CardBody>
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
									<Td isNumeric>{invoice.data?.subtotal.toFixed(2)}</Td>
									<Td isNumeric>{((invoice.data?.subtotal || 0) * (invoice.data?.cgst || 0)).toFixed(2)}</Td>
									<Td isNumeric>{((invoice.data?.subtotal || 0) * (invoice.data?.sgst || 0)).toFixed(2)}</Td>
									<Td isNumeric>{((invoice.data?.subtotal || 0) * (invoice.data?.igst || 0)).toFixed(2)}</Td>
									<Td isNumeric>{invoice.data?.total?.toFixed(2)}</Td>
								</Tr>
							</Tbody>
							<Tfoot></Tfoot>
						</Table>
					</TableContainer>
				</CardBody>
			</Card>
			<Heading marginTop={"2rem"} marginBottom={"1rem"} size={"md"}>
				Items Added
			</Heading>

			<TableContainer maxHeight={"calc(100vh - 550px)"} overflowY={"auto"}>
				<Table size="sm">
					<Thead>
						<Tr>
							<Th>SN</Th>
							<Th>Code</Th>
							<Th>Name</Th>
							<Th>Item Price ₹</Th>
							<Th>Discount ₹</Th>
							<Th>Quantity</Th>
							<Th>Sub Total ₹</Th>
							<Th>Tax Rate (%)</Th>
							<Th>Tax ₹</Th>
							<Th>Total ₹</Th>
							<Th></Th>
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
									<Td>
										<Input
											type="number"
											value={item.discount}
											width={"5rem"}
											onChange={(e) => {
												try {
													let discount = parseFloat(e.target.value);
													if (isNaN(discount)) {
														discount = 0;
													}
													setUpdateDiscountRequest({ item, discount });
												} catch (error) {
													console.log(error);
												}
											}}
										/>
									</Td>
									<Td>
										<Input
											type="number"
											value={item.quantity}
											width={"5rem"}
											onChange={(e) => {
												try {
													let quantity = parseFloat(e.target.value);
													if (isNaN(quantity)) {
														quantity = 0;
													}
													setUpdateQuantityRequest({ item, quantity });
												} catch (error) {
													console.log(error);
												}
											}}
										/>
									</Td>
									<Td>{item.subtotal}</Td>
									<Td>
										<Input
											value={(item.cgst + item.sgst + item.igst) * 100}
											width={"5rem"}
											onChange={(e) => {
												try {
													let tax: number = parseInt(e.target.value) / 100;
													console.log(tax);
													if (isNaN(tax)) {
														tax = 0;
													}
													setUpdateTaxRequest({ item, tax: tax });
												} catch (error) {
													console.log(error);
												}
											}}
										/>
									</Td>
									<Td>{((item.cgst + item.sgst + item.igst) * item.subtotal).toFixed(2)}</Td>
									<Td>{item.total.toFixed(2)}</Td>
									<Td>
										{" "}
										<IconButton
											aria-label="Delete Item"
											onClick={(e) => {
												dispatch(deleteLineItem(item.productCode));
											}}
											icon={<BiTrash />}
										/>
									</Td>
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
									onKeyUp={(e) => {
										if (e.key === "Enter") {
											setItemCode(inputBox.current?.value);
										}
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
			{/* <Heading marginBottom={"1rem"} marginTop={"2rem"}>
				Invoice Details
			</Heading> */}
		</form>
	);
}
