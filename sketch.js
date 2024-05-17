const canvasSize = [1000, 1000];

let aiAgent,
	car,
	frontSensor,
	sideSensor,
	obstaclePoints = [],
	grids = [],
	stats,
	shapeCounter = 0;

function setup() {
	createCanvas(canvasSize[0], canvasSize[1]);
	// car = new Car(0, 0);
	car = new Car(width / 2, height / 2);
	frontSensor = new UltraSonicSensor(car, 0);
	sideSensor = new UltraSonicSensor(car, PI / 2);
	aiAgent = new AiAgent(car, frontSensor, sideSensor);
	stats =[
		// ["mouseX", () => (mouseX - width / 2).toFixed(2)],
		// ["mouseY", () => (mouseY - height / 2).toFixed(2)],
		["mouseX", () => mouseX.toFixed(2)],
		["mouseY", () => mouseY.toFixed(2)],
		["Car X,Y", () => `${round(car.x)} ${round(car.y)}`],
		["Car Angle", () => `${(car.angle % (2 * PI)).toFixed(2)} ${((car.angle * 180 / PI) % 360).toFixed(2)}`],
		["Front Sensor", () => aiAgent.frontSensor.getDistance()],
		["Side Sensor", () => aiAgent.sideSensor.getDistance()],
		["State", () => aiAgent.state],
	]
}

function draw() {
	frameRate(60);
	background(220);
	drawCursor();
	drawStats();
	// translate(width / 2, height / 2);
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
		for (let i = 0; i < shapeCounter + 1; i++) {
			beginShape();
			obstaclePoints.filter(p => p.z === i).forEach(p => {
				vertex(p.x, p.y);
			});
			endShape();
		}
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
	// obstaclePoints.push(createVector(mouseX - width / 2, mouseY - height / 2, shapeCounter));
	obstaclePoints.push(createVector(mouseX, mouseY, shapeCounter));
}

function keyPressed() {
	if (key === " ")
		shapeCounter++;
	else if (key === "g" && aiAgent.state >= 6)
		car.goTo(mouseX, mouseY);
}

function drawCursor() {
	stroke(0);
	strokeWeight(0.5);
	line(0, mouseY, width, mouseY);
	line(mouseX, 0, mouseX, height);
}

function drawStats() {
	textSize(15);
	fill(0)
	for (let i = 0; i < stats.length; i++) {
		const stat = stats[i];
		text(`${stat[0]}:\t${stat[1]()}`, 5, i * 18 + 15);
	}
}