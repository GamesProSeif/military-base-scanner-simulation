class Car {
	constructor(x, y) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.angle = PI / 2;
		this.turnSpeed = 0.01;
		this.speed = 1.5;
		this.delay = 20;
		this.wid = 20;
		this.len = 30;
		// this.frontSensor = new UltraSonicSensor(this, 0);
		// this.sideSensor = new UltraSonicSensor(this, PI / 2);

		this.moving = false;
		this.turning = false;

		this.outlineCreated = false;
		this.followingWall = false;

		this.deltaAngle = 0;
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
					[cos(this.angle), -sin(this.angle), 0],
					[sin(this.angle), cos(this.angle), 0],
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

	moveForward(distance = 10) {
		if (this.moving || this.turning)
			return;
		this.moving = true;
		const newX = this.speed * cos(this.angle);
		const newY = -this.speed * sin(this.angle);

		let deltaX = distance * cos(this.angle);
		let deltaY = -distance * sin(this.angle);
		const targetX = this.x + deltaX;
		const targetY = this.y + deltaY;

		deltaX = abs(deltaX);
		deltaY = abs(deltaY);

		return new Promise(async (res) => {
			while (true) {
				await sleep(this.delay);
				this.x += newX;
				this.y += newY;

				deltaX -= abs(newX);
				deltaY += abs(newY);

				if (deltaX < 0 && deltaY > 0) {
					res();
					this.x = round(targetX);
					this.y = round(targetY);
					this.moving = false;
					break;
				}

			}
		});
	}

	turn(angle) {
		if (this.turning)
			return;
		this.turning = true;
		const targetAngle = this.angle + angle;
		this.deltaAngle += angle;

		return new Promise(async (res) => {
			while (true) {
				this.angle += this.turnSpeed * (angle > 0 ? 1 : -1);
				await sleep(this.delay);
				if (
					angle > 0 && this.angle >= targetAngle
					|| angle < 0 && this.angle <= targetAngle
				) {
					res();
					this.turning = false;
					this.angle = (targetAngle);
					break;
				}
			}
		});
	}

	async goTo(x, y) {
		// implement A* algorithm
		const destination = createVector(x, y);
		const position = createVector(this.x, this.y);
		const distance = position.dist(destination);
		const carAngle = p5.Vector.fromAngle(this.angle);

		const direction = p5.Vector.sub(destination, position);

		const deltaAngle = direction.angleBetween(carAngle);

		// console.log("position:", position.x, position.y);
		// console.log("destination:", destination.x, destination.y);
		// console.log("distance:", distance);
		// console.log("carAngle:", carAngle);
		// console.log("direction:", direction.x, direction.y);
		// console.log("deltaAngle:", deltaAngle);

		await this.turn(deltaAngle);
		await this.moveForward(distance);
	}

	show() {
		const transformedPoints = multiplyMatrices(this.points, this.transMatrix);

		strokeWeight(1);
		stroke(0);
		fill(255);
		beginShape();
			transformedPoints.forEach(point => vertex(point[0], point[1]));
		endShape(CLOSE);

		strokeWeight(5);
		point(this.x, this.y);

	}

	startDeltaAngle() {
		this.deltaAngle = 0;
	}
}