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
} from "@chakra-ui/react";
import { IProduct } from "@src/models/IProduct";
import { useAddProductMutation } from "@src/state/services/productService";
import React from "react";

export default function AddProduct() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [addProduct, {}] = useAddProductMutation();
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();
		let data: IProduct = {
			code: (event.target as any).code?.value,
			name: (event.target as any).name?.value,
			category: (event.target as any).category?.value,
			price: parseFloat((event.target as any).price?.value || "0"),
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
			<Button colorScheme="cyan" onClick={onOpen}>
				Add Product
			</Button>
			<Modal size={"lg"} isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
				<ModalOverlay />
				<ModalContent>
					<form onSubmit={handleSubmit}>
						<ModalHeader>Add New Product</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormControl isRequired>
								<FormLabel>Code</FormLabel>
								<Input name="code" type="text" />
								<FormHelperText>Enter the product code</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Name</FormLabel>
								<Input name="name" type="text" />
								<FormHelperText>Enter the product name</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Category</FormLabel>
								<Input name="category" type="text" />
								<FormHelperText>Enter the product category</FormHelperText>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Price</FormLabel>
								<NumberInput step={0.01} pattern="^\d*\.?\d*$" name="price" max={50000} min={0} defaultValue={0}>
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
								<NumberInput pattern="^\d*$" step={1} name="quantity" max={500} min={0} defaultValue={0}>
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
