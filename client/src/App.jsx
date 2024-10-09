import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './service'
import RouteWrapper from './components/RouteWrapper'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={
							<RouteWrapper route={route} />
						}
					/>
				))}
			</Routes>
		</BrowserRouter>
	)
}
