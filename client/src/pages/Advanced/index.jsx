import About from './components/About'
import { Divider } from '@chakra-ui/react'
import Delete from './components/Delete'

export default function Advanced() {

	return (
		<>
			<Delete />
			<Divider marginY={5} />
			<About />
		</>
	)
}
