import { byColor, unexploredMapByte } from './colors.mjs';

export const pixelDataToMapBuffer = (pixels) => {
	const data = pixels.data;
	// https://tibiamaps.io/guides/map-file-format#visual-map-data
	let hasData = false;
	const buffer = Buffer.alloc(0x10000);
	let bufferIndex = -1;
	let xIndex = -1;
	while (++xIndex < 256) {
		const xOffset = xIndex * 4;
		let yIndex = -1;
		while (++yIndex < 256) {
			const yOffset = yIndex * 256 * 4;
			const offset = yOffset + xOffset;
			const r = data[offset];
			const g = data[offset + 1];
			const b = data[offset + 2];
			// Discard alpha channel data; it’s always 0xFF anyway.
			//const a = data[offset + 3];
			// Get the byte value that corresponds to this color.
			const id = `${r},${g},${b}`;
			const byteValue = byColor.get(id);
			console.assert(byteValue != null, `Unknown color ID: ${id}`);
			buffer.writeUInt8(byteValue, ++bufferIndex);
			if (!hasData && byteValue !== unexploredMapByte) {
				hasData = true;
			}
		}
	}
	return hasData && buffer;
};
