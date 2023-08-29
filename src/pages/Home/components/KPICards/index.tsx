import { Card, CardHeader, CardBody, Text } from "@chakra-ui/react";

export function KPICard({ name, value }: { name: string; value: string }) {
	return (
		<Card
			width={"10rem"}
			style={{
				boxShadow: "1px 2px 8px 1px rgba(119, 224, 253, 0.1)",
			}}
		>
			<CardHeader fontSize={"xs"} paddingBottom={0}>
				{name}
			</CardHeader>
			<CardBody paddingTop={0}>
				<Text fontSize="2xl">{value}</Text>
			</CardBody>
		</Card>
	);
}
