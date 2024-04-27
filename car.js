class Car {
	constructor(x, y) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.angle = PI / 2;
		this.turnSpeed = 0.01;
		this.speed = 0.5;
		this.moveDistance = 10;
		this.delay = 20;
		this.wid = 20;
		this.len = 30;
		this.frontSensor = new UltraSonicSensor(this, 0);
		this.sideSensor = new UltraSonicSensor(this, PI / 2);

		this.moving = false;
		this.turning = false;

		this.outlineCreated = false;
		this.followingWall = false;
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

	moveForward() {
		if (this.moving || this.turning)
			return;
		this.moving = true;
		const newX = this.speed * cos(this.angle);
		const newY = -this.speed * sin(this.angle);
		this.x += newX;
		this.y += newY;

		let i = 0;

		return new Promise(async (res) => {
			while (true) {
				await sleep(this.delay);
				this.x += newX;
				this.y += newY;
				i += this.speed;
				if (i >= this.moveDistance) {
					res();
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
		// const timeToTurn = abs(angle / this.turnSpeed);
		const targetAngle = this.angle + angle;

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
					this.angle = targetAngle;
					break;
				}
			}
		});
	}

	scan(sensor, distance) {
		for (let i = 0; i <= distance; i++) {
			let x = this.x + i * cos(sensor.angle - this.angle);
			let y = this.y + i * sin(sensor.angle - this.angle);
			let grid = Grid.addGrid(x, y);
			grid.discovered = true;
			if (distance < sensor.range && i === floor(distance))
				grid.obstacle = 1;
		}
	}

	async update() {
		const frontDistance = this.frontSensor.getDistance();
		const sideDistance = this.sideSensor.getDistance();
		this.scan(this.frontSensor, frontDistance);
		this.scan(this.sideSensor, sideDistance);

		if (this.moving || this.turning)
			return;

		if (this.followingWall) {
			await this.moveForward();
			await this.moveForward();
			let newSideDistance = this.sideSensor.getDistance();
			if (newSideDistance === this.sideSensor.range)
			// continue from here, when side wall ends
				await this.turn(-PI / 2);
				// this.followingWall = false;
			else
				await this.turn(0.045 * (sideDistance - newSideDistance));
		} else if (!this.outlineCreated) {
			if (frontDistance > this.frontSensor.range - 20)
				await this.moveForward();
			else if (frontDistance <= this.frontSensor.range - 20) {
				await this.turn(PI / 2);
				this.followingWall = true;
			}
		}

		// if (!this.flag) {
		// 	this.flag = true;
		// 	await this.moveForward();
		// }

		// this.moveForward();
		// await this.turn(PI/2);
		// this.angle += 0.01;
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

		this.frontSensor.show();
		this.sideSensor.show();
	}
}