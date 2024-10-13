import Papa from 'papaparse';
import SparkMD5 from 'spark-md5';
import { boxFields, callAPI } from '.';
import lzstring from 'lz-string';

// export async function addBoxes(payload) {
// 	return new Promise((resolve, reject) => {
// 		const data = JSON.parse(lzstring.decompressFromEncodedURIComponent(payload.data));
// 		const invalidInstances = [];
// 		const validInstances = [];

// 		data.forEach((instance) => {
// 			if (Math.random() < 0.5) {
// 				invalidInstances.push(instance);
// 			} else {
// 				validInstances.push(instance);
// 			}
// 		});

// 		setTimeout(() => {
// 			resolve({
// 				invalidInstances,
// 				validInstances,
// 			});
// 		}, Math.random() * 5000);
// 	});
// }

export async function handleDistributionList(file, setOutput) {
	const data = await file.text();
	const boxes = [];
	const user = JSON.parse(localStorage.getItem('user'));

	Papa.parse(data, {
		skipEmptyLines: true,
		step: (element) => {
			const newBox = {};
			const fields = [...boxFields, 'schoolLatitude', 'schoolLongitude'];

			fields.forEach((field, index) => {
				newBox[field] = element.data[index];
			});
			newBox.schoolLatitude = parseFloat(newBox.schoolLatitude.replace(',', '.'));
			newBox.schoolLongitude = parseFloat(newBox.schoolLongitude.replace(',', '.'));
			newBox.adminId = user.id;
			newBox.createdAt = new Date().getTime();
			newBox.id = SparkMD5.hash(JSON.stringify(newBox) + Math.random() * 1000);

			setOutput(prev => {
				return [...prev,
					`Generated item ${newBox.id}.`
				];
			})

			boxes.push(newBox);
		},
		complete: () => {
			boxes.shift();
			const BUFFER_LENGTH = 500;
			const numBoxes = boxes.length;
			let uploaded = 0;
			const responses = [];

			const processBuffer = (buffer) => {
				const payload = {
					data: lzstring.compressToEncodedURIComponent(JSON.stringify(buffer)),
				};
				callAPI('POST', 'boxes', payload)
					.then((res) => {
						responses.push(res);
						uploaded += buffer.length;
						setOutput(prev => {
							return [...prev,
								`${uploaded} items uploaded.`,
							];
						})
						if (uploaded < numBoxes) {
							// There are more boxes
							const nextBuffer = boxes.slice(uploaded, uploaded + BUFFER_LENGTH);
							processBuffer(nextBuffer);
						} else {
							// All boxes have been uploaded
							const invalid = responses.flatMap((res) => res.invalidInstances);
							const valid = responses.flatMap((res) => res.validInstances);

							setOutput(prev => {
								const invalids = invalid.map((instance) => {
									const instanceFields = {};
									boxFields.forEach((field) => {
										instanceFields[field] = instance[field];
									});
									return JSON.stringify(instanceFields);
								});

								return [...prev,
									`-------`,
									`All items uploaded.`,
									`${valid.length} valid instances.`,
									`${invalid.length} invalid instances.`,
									`-------`,
									`Invalid instances:`,
									...invalids,
									`-------`,
									`Reload the page to see the changes.`,
									`-------`,
								];
							});
						}
					})
					.catch((err) => {
						setOutput(prev => {
							return [...prev,
								`Error uploading items`,
								err.response?.data?.error?.message || err.message,
							];
						})
					});
			};

			processBuffer(boxes.slice(0, BUFFER_LENGTH));
		}
	})
}
