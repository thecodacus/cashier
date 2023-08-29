import { Box, Flex, Stack } from "@chakra-ui/react";
import { RevenueChart } from "./components/RevenueChart";
import { KPICard } from "./components/KPICards";
import { RecentCustomersTable } from "./components/RecentCustomersList";

export default function Home() {
	/* create a dashboard for all the kpis */
	return (
		<Stack className="dashboard">
			{/* KPI Cards */}
			<Flex
				className="top-cards"
				css={{
					">*": {
						flex: 1,
					},
					gap: "1rem",
				}}
			>
				<KPICard name="Total Sales This Month" value={`₹${1000}`} />
				<KPICard name="Total Orders This Month" value="100" />
				<KPICard name="New Customers This Month" value="20" />
				<KPICard name="Profit This Month" value={`₹${200}`} />
			</Flex>
			{/* Chart */}
			<Flex flex={1} className="revenue-chart" direction={"row"} gap={3}>
				<Box className="chart1" flex={2}>
					<RevenueChart
						header="Revenue for last 7 days"
						data={[
							{ name: "1", value: 4000 },
							{ name: "2", value: 3000 },
							{ name: "3", value: 2000 },
							{ name: "4", value: 2780 },
							{ name: "5", value: 1890 },
							{ name: "6", value: 2390 },
							{ name: "7", value: 3490 },
						]}
					/>
				</Box>
				<Box className="chart2" flex={1}>
					<RecentCustomersTable
						header="Recent Customers"
						items={[
							{
								id: 1,
								customerName: "Anirban",
								orderDate: new Date(),
								amount: 2000,
							},
						]}
					/>
				</Box>
			</Flex>

			{/* Recent Orders Table */}
			{/* <RecentOrdersTable /> */}
			{/* Recent Customers Table */}
			{/* <RecentCustomersTable /> */}
		</Stack>
	);
}
