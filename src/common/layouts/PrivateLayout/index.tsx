import { useAppSelector } from "../../../state/store";
import FooterSmallWithSocial from "../../components/Footer";
import SidebarWithHeader from "../../components/Sidebar";
import styles from "./styles.module.scss";
import { Outlet } from "react-router";
import { Navigate } from "react-router-dom";

export default function PrivateLayout() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	if (!isAuthenticated) return <Navigate replace={true} to="/auth/login" state={{ from: `${location.pathname}${location.search}` }} />;
	return (
		<>
			<SidebarWithHeader>
				<div className={styles.content}>
					<Outlet />
				</div>
				<FooterSmallWithSocial />
			</SidebarWithHeader>
		</>
	);
}
