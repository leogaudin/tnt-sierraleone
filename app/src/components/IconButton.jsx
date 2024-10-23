import React from 'react';
import { Pressable, View } from 'react-native';

export default function IconButton({ icon, onPress }) {
	return (
		<Pressable onPress={onPress}>
			<View
				style={{
						height: 42,
						width: 42,
						justifyContent: 'center',
						alignItems: 'center',
						margin: 30,
						borderRadius: 100,
						backgroundColor: '#EFEFEF77',
					}}
			>
				{icon}
			</View>
		</Pressable>
	);
}
