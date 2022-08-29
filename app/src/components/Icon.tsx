import React from 'react';
import {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
	Fontisto,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Octicons,
	SimpleLineIcons,
	Zocial,
} from '@expo/vector-icons';

export interface IC {
	family?:
		| 'AntDesign'
		| 'Entypo'
		| 'EvilIcons'
		| 'Feather'
		| 'FontAwesome'
		| 'FontAwesome5'
		| 'Fontisto'
		| 'Foundation'
		| 'Ionicons'
		| 'MaterialCommunityIcons'
		| 'MaterialIcons'
		| 'Octicons'
		| 'SimpleLineIcons'
		| 'Zocial';
	[name: string]: any;
	[size: number]: any;
	color?: string;
	props?: object;
}

const Icon = ({ family = 'MaterialCommunityIcons', name, size = 24, color, props, ...rest }: IC) => (
	<>
		{family === 'AntDesign' && <AntDesign name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Entypo' && <Entypo name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'EvilIcons' && <EvilIcons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Feather' && <Feather name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'FontAwesome' && <FontAwesome name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'FontAwesome5' && <FontAwesome5 name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Fontisto' && <Fontisto name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Foundation' && <Foundation name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Ionicons' && <Ionicons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'MaterialIcons' && <MaterialIcons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Octicons' && <Octicons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'SimpleLineIcons' && <SimpleLineIcons name={name} size={size} color={color} {...props} {...rest} />}
		{family === 'Zocial' && <Zocial name={name} size={size} color={color} {...props} {...rest} />}
	</>
);

export default Icon;

export const DownloadedIcon = (props: object) => <Icon family='MaterialCommunityIcons' name="arrow-down-circle" color="orange" props={props}/>