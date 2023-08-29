import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface IProps {
	header: string;
	data: {
		name: string;
		value: number;
	}[];
	height?: number;
}
export function RevenueChart({ data, header, height }: IProps) {
	return (
		<Card>
			<CardHeader>
				<Heading fontSize={"md"}>{header}</Heading>
			</CardHeader>
			<CardBody>
				<ResponsiveContainer width="100%" height={height || 300}>
					<AreaChart
						data={data}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}
					>
						{/* <CartesianGrid strokeDasharray="3 3" /> */}

						<XAxis dataKey="name" stroke="white" />
						<YAxis dataKey="value" stroke="white" />
						<Tooltip contentStyle={{ color: "black", stroke: "black" }} />
						{/* <Tooltip /> */}
						<defs>
							<linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="rgba(0,200,255,1)" stopOpacity={1} />
								<stop offset="95%" stopColor="#006986" stopOpacity={0.7} />
							</linearGradient>
						</defs>
						<Area type="monotone" dataKey="value" strokeWidth={3} stroke="#86ddff" fill="url(#cyanGrad)" />
					</AreaChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}
