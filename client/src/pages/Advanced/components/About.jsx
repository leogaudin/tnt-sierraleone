import { Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { palette } from "../../../theme";
import { API_URL } from "../../../service";

export default function About() {
	return (
		<Flex
			direction='column'
			justify='center'
			align='stretch'
			gap={5}
		>
			<Heading>About</Heading>
			<HStack
				gap={2.5}
			>
				<Text size='md' fontWeight='bold'>API URL:</Text>
				<Text
					bg={palette.gray.light}
					padding={2}
					borderRadius={5}
				>
					<code>{API_URL}</code>
				</Text>
			</HStack>
		</Flex>
	)
}
