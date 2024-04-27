const canvasSize = [1000, 1000];

let aiAgent,
	car,
	frontSensor,
	sideSensor,
	obstaclePoints = [],
	grids = [];

function setup() {
	createCanvas(canvasSize[0], canvasSize[1]);
	car = new Car(0, 0);
	frontSensor = new UltraSonicSensor(car, 0);
	sideSensor = new UltraSonicSensor(car, PI / 2);
	aiAgent = new AiAgent(car, frontSensor, sideSensor);
}

function draw() {
	frameRate(60);
	background(220);
	translate(width / 2, height / 2);
	drawObstacles();
	drawGrids();

	aiAgent.run();
	car.show();
	frontSensor.show();
	sideSensor.show();
}

function drawObstacles() {
	stroke(0);
	strokeWeight(1);
	if (obstaclePoints.length > 0) {
		stroke(0);
		strokeWeight(1);
		noFill();
		beginShape();
		obstaclePoints.forEach(p => {
			vertex(p.x, p.y);
		});
		endShape();
		obstaclePoints.forEach(p => {
			strokeWeight(5);
			point(p);
		});
	}
}

function drawGrids() {
	Grid.GRIDS.forEach(grid => grid.show());
}

function mouseClicked() {
	// Grid.addGrid(mouseX - width / 2, mouseY - height / 2);
	obstaclePoints.push(createVector(mouseX - width / 2, mouseY - height / 2));
}