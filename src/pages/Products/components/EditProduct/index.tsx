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
	IconButton,
	Icon,
} from "@chakra-ui/react";
import { IProduct } from "@src/models/IProduct";
import { useDeleteProductMutation, useSaveProductMutation } from "@src/state/services/productService";
import React from "react";
import { BiEditAlt } from "react-icons/bi";

interface IProps {
	product: IProduct;
}

export default function EditProduct({ product }: IProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [saveProduct, {}] = useSaveProductMutation();
	const [deleteProduct, {}] = useDeleteProductMutation();
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
			await saveProduct(data).unwrap();
		} catch (error) {
			console.log(error);
		}
		onClose();
	};
	const handleDelete = async (product: IProduct) => {
		try {
			if (product.code) await deleteProduct(product.code).unwrap();
		} catch (error) {
			console.log(error);
		}
		onClose();
	};
	return (
		<>
			<IconButton aria-label="edit product" icon={<Icon as={BiEditAlt} onClick={onOpen} />} />
			<Modal size={"lg"} isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
				<ModalOverlay />
				<ModalContent>
					<form onSubmit={handleSubmit}>
						<ModalHeader>Edit Product</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormControl isRequired>
								<FormLabel>Code</FormLabel>
								<Input disabled defaultValue={product.code} name="code" type="text" />
								<FormHelperText>Enter the product code</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Name</FormLabel>
								<Input defaultValue={product.name} name="name" type="text" />
								<FormHelperText>Enter the product name</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Category</FormLabel>
								<Input defaultValue={product.category} name="category" type="text" />
								<FormHelperText>Enter the product category</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Buying Price</FormLabel>
								<NumberInput step={0.01} pattern="^\d*\.?\d*$" name="buyingPrice" max={50000} min={0} defaultValue={product.buyingPrice.toFixed(2)}>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Enter the product price</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Selling Price</FormLabel>
								<NumberInput step={0.01} pattern="^\d*\.?\d*$" name="sellingPrice" max={50000} min={0} defaultValue={product.sellingPrice.toFixed(2)}>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Enter the product price</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Quantity</FormLabel>
								<NumberInput pattern="^\d*$" step={1} name="quantity" max={500} min={0} defaultValue={product.quantity}>
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
							<Button variant="outline" colorScheme="red" onClick={() => handleDelete(product)}>
								Delete
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
