function multiplyMatrices(points, transMatrix) {
	// Check if the number of columns in the first matrix (points) matches the number of rows in the second matrix (transMatrix)
	if (points[0].length !== transMatrix.length) {
		throw new Error("Incompatible matrix dimensions for multiplication");
	}

	const result = [];
	for (let i = 0; i < points.length; i++) {
		result[i] = [];
		for (let j = 0; j < transMatrix[0].length; j++) {
			let sum = 0;
			for (let k = 0; k < points[0].length; k++) {
				sum += points[i][k] * transMatrix[k][j];
			}
			result[i][j] = sum;
		}
	}

	return result;
}
