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

function segmentsIntersect(
	cartesianPoint1,
	cartesianPoint2,
	polarPoint,
	angle,
	radius
) {
	// Convert polar coordinates to endpoint of the second segment
	const polarX = polarPoint.x + radius * Math.cos(angle);
	const polarY = polarPoint.y + radius * Math.sin(angle);
	const polarPoint2 = { x: polarX, y: polarY };

	console.log(cartesianPoint1, cartesianPoint2, polarPoint, polarPoint2);

	// Check for trivial cases (one endpoint is on the other segment)
	if (
		isPointOnLineSegment(cartesianPoint1, cartesianPoint2, polarPoint) ||
		isPointOnLineSegment(cartesianPoint1, cartesianPoint2, polarPoint2)
	) {
		return { x: polarPoint.x, y: polarPoint.y }; // Intersection at polar point
	}

	// Line equation for the Cartesian segment
	const lineA = cartesianPoint2.y - cartesianPoint1.y;
	const lineB = cartesianPoint1.x - cartesianPoint2.x;
	const lineC = lineA * cartesianPoint1.x + lineB * cartesianPoint1.y;

	// Check if the polar segment intersects the line containing the Cartesian segment
	const denominator = lineA * Math.cos(angle) + lineB * Math.sin(angle);
	if (denominator === 0) {
		// Lines are parallel, no intersection
		return null;
	}

	const numerator =
		lineA * (polarPoint.x - cartesianPoint1.x) +
		lineB * (polarPoint.y - cartesianPoint1.y);
	const t = numerator / denominator;

	// Check if intersection point is within the bounds of both segments
	if (t < 0 || t > 1) {
		return null;
	}

	const intersectionX = polarPoint.x + t * radius * Math.cos(angle);
	const intersectionY = polarPoint.y + t * radius * Math.sin(angle);
	return { x: intersectionX, y: intersectionY };
}

function isPointOnLineSegment(point1, point2, point) {
	return (
		(point.x - point1.x) / (point2.x - point1.x) ===
			(point.y - point1.y) / (point2.y - point1.y) &&
		Math.min(point1.x, point2.x) <= point.x &&
		point.x <= Math.max(point1.x, point2.x) &&
		Math.min(point1.y, point2.y) <= point.y &&
		point.y <= Math.max(point1.y, point2.y)
	);
}

function ccw(A, B, C) {
	return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

// Return true if line segments AB and CD intersect
function intersect(A, B, C, angle, radius) {
	let D = {
		x: C.x + radius * cos(angle),
		y: C.y + radius * sin(angle),
	};
	return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D);
}

function findIntersection(p0, p1, p2, angle, radius) {
	let p3 = {
		x: p2.x + radius * cos(angle),
		y: p2.y + radius * sin(angle),
	};

	// Define vectors for each segment
	const s1 = {
		x: p1.x - p0.x,
		y: p1.y - p0.y,
	};
	const s2 = {
		x: p3.x - p2.x,
		y: p3.y - p2.y,
	};

	// Calculate denominator
	const denominator = s1.x * s2.y - s1.y * s2.x;

	// Check for parallel lines (denominator is 0)
	if (denominator === 0) {
		return null; // Lines are parallel
	}

	// Calculate vectors from p0 to p2 and p0 to intersection point
	const t = {
		x: p2.x - p0.x,
		y: p2.y - p0.y,
	};

	// Calculate intersection point parameters (ua and ub)
	const ua = -(s2.x * t.y - s2.y * t.x) / denominator;
	const ub = -(s1.x * t.y - s1.y * t.x) / denominator;

	// Check if intersection lies within segments
	if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
		// Intersection point
		return {
			x: p0.x + ua * s1.x,
			y: p0.y + ua * s1.y,
		};
	} else {
		// Intersection lies outside segments
		return null;
	}
}

function cartesianToPolar(x1, y1, x2, y2) {
	const x = x2 - x1;
	const y = y2 - y1;

	// Calculate radius (distance from origin)
	const radius = Math.hypot(x, y); // Math.hypot for cleaner hypotenuse calculation

	// Calculate angle (theta) in radians using atan2 for proper quadrant handling
	const theta = Math.atan2(y, x);

	// Return polar coordinates (radius, theta)
	return {
		radius,
		theta,
	};
}

function sleep(ms) {
	return new Promise((res) => { setTimeout(res, ms) });
}
