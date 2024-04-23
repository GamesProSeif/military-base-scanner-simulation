class UltraSonicSensor {
	constructor(car, angle) {
		this.car = car;
		this.angle = angle;
		this.range = 100;
	}

	show() {
		strokeWeight(2);
		stroke(100, 100, 255);
		const endX = this.car.x + this.range * cos(this.angle + this.car.angle);
		const endY = this.car.y + this.range * sin(this.angle + this.car.angle);
		line(this.car.x, this.car.y, endX, endY);
		strokeWeight(8);
		point(endX, endY);
	}
}