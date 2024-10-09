import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { palette } from "../theme";
import { useTranslation } from "react-i18next";

export default function BoxesLoading() {
	const { t } = useTranslation();

	return (
		<Flex
			width='100%'
			height='100vh'
			direction='row'
			justify='center'
			align='center'
			color={palette.primary.dark}
		>
			<Heading>
				{t('boxesLoading')}
			</Heading>
			<Spinner
				marginX={10}
				size='xl'
			/>
		</Flex>
	)
}
