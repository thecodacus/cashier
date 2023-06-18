import { Box, Button, Flex, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from "@chakra-ui/react";
import SelectCustomer from "./components/SelectCustomer";
import { useAppDispatch, useAppSelector } from "@src/state/store";
import { deaftInvoice } from "@src/state/services/invoiceService";
import AddLineItemsForm from "./components/AddLineItemsForm";
import CollectPayment from "./components/CollectPayment";

const steps = [
	{ id: "customer", title: "Customer Details", description: "Select customer or add new customer" },
	{ id: "lineitems", title: "Line Items", description: "Add products for billing" },
	{ id: "payment", title: "Payment", description: "Collect Payment" },
];

export default function NewInvoice() {
	const { activeStep, setActiveStep } = useSteps({
		index: 0,
		count: steps.length,
	});
	const buyer = useAppSelector((s) => s.checkout.buyer);
	const lineItems = useAppSelector((s) => s.checkout.lineItems);
	const dispatch = useAppDispatch();
	const nextBtn = (enable: boolean, onNext?: Function) => (
		<Button
			isDisabled={enable == false}
			onClick={() => {
				setActiveStep((x) => x + 1);
				if (onNext) onNext();
			}}
		>
			Next
		</Button>
	);
	const prevBtn = (enable: boolean) => (
		<Button isDisabled={!enable} onClick={() => setActiveStep((x) => x - 1)}>
			Back
		</Button>
	);
	const navigation = (enableNext: boolean, onNext?: Function) => (
		<Flex justifyContent={"space-between"}>
			{activeStep > 0 && prevBtn(true)}
			<div style={{ paddingTop: "2rem", width: "1px" }}></div>
			{activeStep < steps.length && nextBtn(enableNext, onNext)}
		</Flex>
	);
	return (
		<Box>
			<Stepper index={activeStep}>
				{steps.map((step, index) => (
					<Step key={index}>
						<StepIndicator>
							<StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
						</StepIndicator>

						<Box flexShrink="0">
							<StepTitle>{step.title}</StepTitle>
							<StepDescription>{step.description}</StepDescription>
						</Box>

						<StepSeparator />
					</Step>
				))}
			</Stepper>
			<Box marginTop={"2rem"}>
				{steps[activeStep].id == "customer" && (
					<>
						{navigation(buyer.data != null)}
						<SelectCustomer buyer={buyer.data} />
					</>
				)}
				{steps[activeStep].id == "lineitems" && (
					<>
						{navigation(lineItems.data.length > 0)}
						<AddLineItemsForm />
					</>
				)}
				{steps[activeStep].id == "payment" && (
					<>
						{navigation(false)}
						<CollectPayment />
					</>
				)}
			</Box>
		</Box>
	);
}
