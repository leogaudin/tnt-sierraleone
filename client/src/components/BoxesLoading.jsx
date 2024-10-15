import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { palette } from "../theme";
import { useTranslation } from "react-i18next";

export default function BoxesLoading() {
	const { t } = useTranslation();

	return (
		<Flex
			direction={{ base: 'column', md: 'row' }}
			justify='center'
			align='center'
			textAlign='center'
			color={palette.primary.dark}
			marginTop='33vh'
		>
			<Heading
				fontWeight='normal'
			>
				{t('boxesLoading')}
			</Heading>
			<Spinner
				marginX={10}
				marginY={5}
				size='xl'
			/>
		</Flex>
	)
}
