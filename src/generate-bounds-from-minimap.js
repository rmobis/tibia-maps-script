'use strict';

const path = require('path');

const glob = require('./glob-promise.js');
const writeJson = require('./write-json.js');

const minimapIdToAbsoluteXyz = require('./minimap-id-to-absolute-xyz.js');

const generateBoundsFromMinimap = async (mapsDirectory, dataDirectory) => {
	const files = await glob(`${mapsDirectory}/*.png`);
	const bounds = {
		'xMin': +Infinity,
		'xMax': -Infinity,
		'yMin': +Infinity,
		'yMax': -Infinity,
		'zMin': +Infinity,
		'zMax': -Infinity,
	};
	const floorIDs = [];
	for (const file of files) {
		const id = path.basename(file, '.png').replace(/^Minimap_(?:Color|WaypointCost)_/, '');
		const coordinates = minimapIdToAbsoluteXyz(id);
		const x = Math.floor(coordinates.x / 256);
		const y = Math.floor(coordinates.y / 256);
		const z = coordinates.z;
		if (bounds.xMin > x) {
			bounds.xMin = x;
		}
		if (bounds.xMax < x) {
			bounds.xMax = x;
		}
		if (bounds.yMin > y) {
			bounds.yMin = y;
		}
		if (bounds.yMax < y) {
			bounds.yMax = y;
		}
		if (bounds.zMin > z) {
			bounds.zMin = z;
		}
		if (bounds.zMax < z) {
			bounds.zMax = z;
		}
		const floorID = String(z).padStart(2, '0');
		if (!floorIDs.includes(floorID)) {
			floorIDs.push(floorID);
		}
	}
	bounds.width = (1 + bounds.xMax - bounds.xMin) * 256;
	bounds.height = (1 + bounds.yMax - bounds.yMin) * 256;
	bounds.floorIDs = floorIDs.sort();
	writeJson(`${dataDirectory}/bounds.json`, bounds);
	return bounds;
};

module.exports = generateBoundsFromMinimap;
