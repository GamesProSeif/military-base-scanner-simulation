class UltraSonicSensor {
	constructor(car, angle) {
		this.car = car;
		this.angle = angle;
		this.range = 100;
	}

	show() {
		// const endX = this.car.x + this.getDistance() * cos(this.angle - this.car.angle);
		// const endY = this.car.y + this.getDistance() * sin(this.angle - this.car.angle);
		const endX = this.car.x + this.getDistance() * cos(this.angle - this.car.angle);
		const endY = this.car.y + this.getDistance() * sin(this.angle - this.car.angle);
		strokeWeight(2);
		stroke(100, 100, 255);
		line(this.car.x, this.car.y, endX, endY);
		strokeWeight(8);
		point(endX, endY);
	}

	getDistance() {
		let lengths = [this.range];
		if (obstaclePoints.length > 1) {
			for (let i = 0; i < obstaclePoints.length - 1; i++) {
				const p1 = obstaclePoints[i];
				const p2 = obstaclePoints[i + 1];

				const intersection = findIntersection(p1, p2, { x: this.car.x, y: this.car.y }, this.angle - this.car.angle, this.range);

				if (intersection) {
					let { radius } = cartesianToPolar(this.car.x, this.car.y, intersection.x, intersection.y);
					lengths.push(radius);
				}
			}
		}

		return Math.min(...lengths);
	}
}