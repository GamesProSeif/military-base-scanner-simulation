class Car {
	constructor(x, y) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.angle = -PI/2;
		this.speed = 0.5;
		this.wid = 20;
		this.len = 30;
		this.frontSensor = new UltraSonicSensor(this, 0);
		this.sideSensor = new UltraSonicSensor(this, PI / 4);
	}

	get transMatrix() {
		return multiplyMatrices(
			[
				[1, 0, 0],
				[0, 1, 0],
				[-this.x, -this.y, 1]
			],
			multiplyMatrices(
				[
					[cos(this.angle), sin(this.angle), 0],
					[-sin(this.angle), cos(this.angle), 0],
					[0, 0, 1],
				],
				[
					[1, 0, 0],
					[0, 1, 0],
					[+this.x, +this.y, 1]
				]
			)
		);
	}

	get points() {
		return [
			[this.x - this.len / 2, this.y - this.wid / 2, 1],
			[this.x + this.len / 2, this.y - this.wid / 2, 1],
			[this.x + this.len / 2, this.y + this.wid / 2, 1],
			[this.x - this.len / 2, this.y + this.wid / 2, 1],
		];
	}

	moveForward() {
		const newX = this.speed * cos(this.angle);
		const newY = this.speed * sin(this.angle);

		this.x += newX;
		this.y += newY;
	}

	update() {
		// this.moveForward();
	}

	show() {
		const transformedPoints = multiplyMatrices(this.points, this.transMatrix);

		strokeWeight(1);
		stroke(0);
		beginShape();
			transformedPoints.forEach(point => vertex(point[0], point[1]));
		endShape(CLOSE);

		strokeWeight(5);
		point(this.x, this.y);

		this.frontSensor.show();
		this.sideSensor.show();
	}
}