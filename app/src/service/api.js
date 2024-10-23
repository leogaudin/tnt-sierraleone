import { API_URL } from './specific';
import { showToast } from './toast';

export function sendScan(data) {
	return new Promise((resolve, reject) => {
		console.log(JSON.stringify(data))
		fetch(`${API_URL}/scan`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
			.then(response => {
				if (response.status >= 200 && response.status < 300) {
					showToast(
						'success',
						'Success!',
						'Scan sent successfully',
					);
					resolve(response.json());
				} else {
					reject(
						new Error(`Request failed with status code ${response.status}`),
					);
				}
			})
			.catch(error => {
				showToast(
					'error',
					'Error!',
					'Scan could not be sent',
				);
				reject(error);
			});
	});
}
