class AiAgent {
	// Implements military base scanner ai state diagram
	// https://lucid.app/documents/view/89e24568-97a9-45b1-8815-0414a98722c9
	constructor(car, frontSensor, sideSensor) {
		this.car = car;
		this.frontSensor = frontSensor;
		this.sideSensor = sideSensor;
		this.sideScanning = false;
		this.state = 1;
		this.idle = true;

		this.tempPos = null;
	}

	async run() {
		if (this.sideScanning) {
			const sideDistance = this.sideSensor.getDistance();
			this.scan(this.sideSensor, sideDistance);
		}

		if (!this.idle)
			return;
		this.idle = false;

		switch (this.state) {
			case 1:
				if (this.sideSensor.detected) {
					await this.sideFaceWall();
					this.sideScanning = true;
					this.state = 3;
					this.car.startDeltaAngle();
					this.tempPos = createVector(this.car.x, this.car.y);
				}
				else if (this.frontSensor.detected)
					this.state = 2;
				else
					await this.car.moveForward();
				break;
			case 2:
				const sideDistance1 = this.sideSensor.getDistance();
				await this.car.turn(0.01);
				const sideDistance2 = this.sideSensor.getDistance();
				if (sideDistance2 > sideDistance1) {
					this.sideScanning = true;
					this.state = 3;
				}
				this.car.startDeltaAngle();
				this.tempPos = createVector(this.car.x, this.car.y);
				break;
			case 3:
				if (this.frontSensor.detected) {
					await this.car.turn(PI / 2);
					await this.sideFaceWall(); 
					this.sideScanning = true;
					this.state = 3;
				}

				const sideDistance = this.sideSensor.getDistance();
				if (sideDistance > this.sideSensor.range - this.sideSensor.detectDistance) {
					await this.car.turn(-PI / 4);
				} else if (sideDistance > this.sideSensor.range * 0.7) {
					await this.car.turn(-0.1);
				} else if (sideDistance < this.sideSensor.range * 0.2) {
					await this.car.turn(0.2);
				} else if (sideDistance < this.sideSensor.range * 0.3) {
					await this.car.turn(0.1);
				}
				await this.car.moveForward(40);
				const distance = createVector(this.car.x, this.car.y).dist(this.tempPos);
				if (distance <= 30)
					this.state = 4;
				break;
			case 4:
				if (this.car.deltaAngle <= -5)
					this.state = 5;
				else if (this.car.deltaAngle >= 5) {
					Grid.fillGrid();
					const contour = Grid.findInnerPath();
					let closestPixel = contour[0];
					let closestDistance = Infinity;
					for (const c of contour) {
						const distance = dist(this.car.x, this.car.y, c.x, c.y);
						if (distance < closestDistance)
							closestPixel = c;
					}
					this.sideScanning = false;
					await this.car.goTo(closestPixel.x, closestPixel.y);
					this.state = 6;
				}
				break;
			case 5:
				await this.car.turn(PI / 2);
				this.sideScanning = false;
				this.state = 1;
				break;
			case 6:
				break;
			case 7:
				break;
			case 8:
				break;
			case 9:
				break;
			case 10:
				break;
			case 11:
				break;
			default:
				break;
		}

		this.idle = true;
	}

	scan(sensor, distance) {
		for (let i = 0; i <= distance; i++) {
			let x = this.car.x + i * cos(sensor.angle - this.car.angle);
			let y = this.car.y + i * sin(sensor.angle - this.car.angle);
			let grid = Grid.addGrid(x, y);
			grid.discovered = true;
			if (distance < sensor.range && i === floor(distance)) {
				grid.obstacle = 1;
				grid.getNeighbors(true).forEach(g => {
					g.obstacle = 1
					g.discovered = true;
				});
			}
		}
	}

	async sideFaceWall() {
		let sideDistance1 = this.sideSensor.getDistance();
		await this.car.turn(0.01);
		let sideDistance2 = this.sideSensor.getDistance();
		let direction = sideDistance2 < sideDistance1 ? 1 : -1;

		while (true) {
			sideDistance1 = this.sideSensor.getDistance();
			await this.car.turn(0.1 * direction);
			sideDistance2 = this.sideSensor.getDistance();
			if (sideDistance1 < sideDistance2)
				break;
			// if (
			// 	direction === 1 && sideDistance1 < sideDistance2
			// 	|| direction === -1 && sideDistance1 < sideDistance2
			// )
			// 	break;
		}

	}
}