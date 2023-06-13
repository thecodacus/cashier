import { Box } from "@chakra-ui/layout";
import { Outlet } from "react-router";

export default function PublicLayout() {
	return (
		<Box>
			<Outlet />
		</Box>
	);
}
