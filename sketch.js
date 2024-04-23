let car;

function setup() {
	createCanvas(1000, 1000);
	car = new Car(width / 2, height * 5 / 6);
	// car = new Car(0, 0);
}

function draw() {
	background(220);
	car.update();
	car.show();
}