import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	useColorModeValue,
	theme,
} from "@chakra-ui/react";
import { IProduct } from "@src/models/IProduct";
import { useAddProductMutation, useGetAllProductsQuery } from "@src/state/services/productService";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";

const resetGroup = () => ({
	code: "",
	name: "",
	category: "",
	buyingPrice: 0,
	sellingPrice: 0,
	quantity: 0,
});

export default function AddProduct() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [addProduct, {}] = useAddProductMutation();
	const { data: products } = useGetAllProductsQuery();
	const [groupDetails, setGroupDetails] = useState<IProduct>(resetGroup());
	const [catagories, setCatagories] = useState<Array<{ [key: string]: any }>>([]);
	const backgroundColor = useColorModeValue("white", theme.colors.gray[700]);
	const bgHighlightColor = useColorModeValue("white", theme.colors.gray[600]);
	const fontColor = useColorModeValue("white", theme.colors.gray[100]);
	const getStyleConfig = () => {
		const colourStyles: StylesConfig = {
			menu: (styles) => ({ ...styles, backgroundColor }),
			control: (styles) => ({
				...styles,
				backgroundColor,
				borderColor: theme.colors.gray[600],
				padding: 0,
				color: fontColor,
			}),
			option: (styles) => {
				return {
					...styles,
					backgroundColor,
					color: fontColor,
					cursor: "default",

					":active": {
						...styles[":active"],
						backgroundColor: bgHighlightColor,
					},
					":hover": {
						...styles[":hover"],
						backgroundColor: bgHighlightColor,
					},
				};
			},
			input: (styles) => ({ ...styles }),
			placeholder: (styles) => ({ ...styles }),
			singleValue: (styles) => ({ ...styles, color: fontColor }),
		};
		return colourStyles;
	};
	useEffect(() => {
		let categories = Array.from(new Set(products?.map((x) => x.category) || []));

		setCatagories(
			categories.map((x: string) => {
				let data: { value: string; label: string } = {
					value: x,
					label: x,
				};
				return data;
			})
		);
	}, [products]);

	const onCodeChange = (code: string) => {
		if (code.trim() == "") return setGroupDetails(resetGroup());
		let found_product = products?.find((x) => x.code == code);
		if (found_product) setGroupDetails(found_product);
	};
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();
		let data: IProduct = {
			code: (event.target as any).code?.value,
			name: (event.target as any).name?.value,
			category: (event.target as any).category?.value,
			buyingPrice: parseFloat((event.target as any).buyingPrice?.value || "0"),
			sellingPrice: parseFloat((event.target as any).sellingPrice?.value || "0"),
			quantity: parseInt((event.target as any).quantity?.value || "0"),
		};
		try {
			await addProduct(data).unwrap();
		} catch (error) {
			console.log(error);
		}
		onClose();
	};
	return (
		<>
			<Button
				colorScheme="cyan"
				onClick={() => {
					setGroupDetails(resetGroup());
					onOpen();
				}}
			>
				Add Product
			</Button>
			<Modal
				size={"lg"}
				isCentered
				onClose={() => {
					setGroupDetails(resetGroup());
					onClose();
				}}
				isOpen={isOpen}
				motionPreset="slideInBottom"
			>
				<ModalOverlay />
				<ModalContent>
					<form onSubmit={handleSubmit}>
						<ModalHeader>Add New Product</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormControl isRequired>
								<FormLabel>Code</FormLabel>
								<Input
									onKeyUp={(e) => {
										onCodeChange(e.currentTarget.value);
									}}
									name="code"
									type="text"
								/>
								<FormHelperText>Enter the product code</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Name</FormLabel>
								<Input
									value={groupDetails.name}
									onChange={(e) => {
										setGroupDetails((details) => {
											let data = { ...details };
											data.name = `${(e.target as any).value || ""}`;
											return data;
										});
									}}
									name="name"
									type="text"
								/>
								<FormHelperText>Enter the product name</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Category</FormLabel>
								<CreatableSelect
									styles={getStyleConfig()}
									isClearable
									options={catagories}
									value={groupDetails.category && groupDetails.category.trim() !== "" ? { label: groupDetails.category, value: groupDetails.category } : undefined}
									onChange={(e) => {
										let selectedItem: { value: string; label: string } = e as any;

										setGroupDetails((details) => {
											let data = { ...details };
											data.category = `${selectedItem?.value || ""}`;
											return data;
										});
									}}
									name="category"
								/>
								{/* <Input /> */}
								<FormHelperText>Enter the product category</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Buing Price</FormLabel>
								<NumberInput
									value={groupDetails.buyingPrice || 0}
									onChange={(e) => {
										setGroupDetails((details) => {
											let data = { ...details };
											data.buyingPrice = parseFloat(e || "0");
											return data;
										});
									}}
									step={0.01}
									pattern="^\d*\.?\d*$"
									name="buyingPrice"
									max={50000}
									min={0}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Enter the product buy price</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Selling Price</FormLabel>
								<NumberInput
									value={groupDetails.sellingPrice || 0}
									onChange={(e) => {
										setGroupDetails((details) => {
											let data = { ...details };
											data.sellingPrice = parseFloat(e || "0");
											return data;
										});
									}}
									step={0.01}
									pattern="^\d*\.?\d*$"
									name="sellingPrice"
									max={50000}
									min={0}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Enter the product sell price</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Quantity</FormLabel>
								<NumberInput
									value={groupDetails.quantity || 0}
									onChange={(e) => {
										setGroupDetails((details) => {
											let data = { ...details };
											data.quantity = parseInt(e || "0");
											return data;
										});
									}}
									pattern="^\d*$"
									step={1}
									name="quantity"
									max={500}
									min={0}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Enter available product quantity</FormHelperText>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Button type="submit" colorScheme="cyan" mr={3}>
								Save
							</Button>
							<Button variant="ghost" onClick={onClose}>
								Close
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
