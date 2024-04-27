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
					let sideDistance1 = this.sideSensor.getDistance();
					await this.car.turn(0.01);
					let sideDistance2 = this.sideSensor.getDistance();
					let direction = sideDistance2 < sideDistance1 ? 1 : -1;

					do {
						sideDistance1 = this.sideSensor.getDistance();
						await this.car.turn(0.01 * direction);
						sideDistance2 = this.sideSensor.getDistance();
						if (
							direction === 1 && sideDistance1 < sideDistance2
							|| direction === -1 && sideDistance1 > sideDistance2
						)
							break;
					} while (true);

					this.sideScanning = true;
					this.state = 3;
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
				break;
			case 3:
				await this.car.moveForward();
				break;
			case 4:
				break;
			case 5:
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
			if (distance < sensor.range && i === floor(distance))
				grid.obstacle = 1;
		}
	}
}