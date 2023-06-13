import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useRef } from "react";
import { useLoginMutation } from "../../../state/services/authService";
import { useAppSelector } from "../../../state/store";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
	const username = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	// Inside your component
	const location = useLocation();
	const navigate = useNavigate();

	const [login, { isLoading, isError }] = useLoginMutation();
	const error = useAppSelector((s) => s.auth.error);
	const onLogin = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!username.current || !password.current) return;
		login({
			username: username.current.value,
			password: password.current.value,
		})
			.unwrap()
			.then(() => {
				const state = location.state;
				const redirectPath = state ? state.from : "/";
				navigate(redirectPath);
			});
	};
	return (
		<Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
					</Text>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
					{isError && <Text color={"red.300"}>{error}</Text>}
					<Stack spacing={4}>
						<FormControl id="username">
							<FormLabel>Username or Email</FormLabel>
							<Input ref={username} type="text" />
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input ref={password} type="password" />
						</FormControl>
						<Stack spacing={10}>
							<Stack direction={{ base: "column", sm: "row" }} align={"start"} justify={"space-between"}>
								<Checkbox>Remember me</Checkbox>
								<Link color={"blue.400"}>Forgot password?</Link>
							</Stack>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								onClick={onLogin}
								disabled={isLoading}
							>
								{isLoading && <Spinner />}
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
