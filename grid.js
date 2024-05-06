class Grid {
	static GRID_SIZE = 10;

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.discovered = false;
		this.obstacle = 0;
	}

	static GRIDS = [];

	static addGrid(x, y) {
		x = round(x);
		y = round(y);
		let gridX = x - x % Grid.GRID_SIZE;
		let gridY = y - y % Grid.GRID_SIZE;
		// if (gridX)
		// 	gridX -= Grid.GRID_SIZE;
		// if (gridY)
		// 	gridY -= Grid.GRID_SIZE;
		let foundGrid = false;
		Grid.GRIDS.forEach(grid => {
			if (grid.x === gridX && grid.y === gridY) {
				foundGrid = grid;
			}
		});


		if (foundGrid)
			return foundGrid;

		const addedGrid = new Grid(gridX, gridY);
		Grid.GRIDS.push(addedGrid);
		return addedGrid;
	}

	static fillGrid() {
		const first = Grid.GRIDS[0];
		let minMax = [first.x, first.y, first.x, first.y];
		Grid.GRIDS.forEach(grid => {
			if (grid.x < minMax[0])
				minMax[0] = grid.x
			if (grid.y < minMax[1])
				minMax[1] = grid.y;
			if (grid.x > minMax[2])
				minMax[2] = grid.x;
			if (grid.y > minMax[3])
				minMax[3] = grid.y;
		});

		const size = Grid.GRID_SIZE;

		for (let i = minMax[0] - 2 * size; i <= minMax[2] + 2 * size; i += size)
			for (let j = minMax[1] - 2 * size; j <= minMax[3] + 2 * size; j += size) {
				let grid = Grid.addGrid(i, j);
				if (
					i === minMax[0] - 2 * size
					|| i === minMax[2] + 2 * size
					|| j === minMax[1] - 2 * size
					|| j === minMax[3] + 2 * size
				) {
					grid.obstacle = 1;
					grid.discovered = true;
				}
			}

		floodFill(minMax[0] - size, minMax[1] - size, 0, 1);
	}

	static get(x, y) {
		x = round(x);
		y = round(y);
		let gridX = x - x % Grid.GRID_SIZE;
		let gridY = y - y % Grid.GRID_SIZE;
		let foundGrid = null;
		Grid.GRIDS.forEach(grid => {
			if (grid.x === gridX && grid.y === gridY) {
				foundGrid = grid;
			}
		});

		return foundGrid;
	}

	show() {
		noStroke();
		if (!this.discovered)
			fill("rgba(0,0,0,0.4)");
		if (this.discovered)
			switch (this.obstacle) {
				case 0:
					fill("rgba(0,0,0,0.1)");
					break;
				case 1:
					fill("rgba(0,0,0,0.7)")
					break;
				default:
					fill("rgba(0,0,0,0.1)");
					break;
			}

		rect(this.x, this.y, Grid.GRID_SIZE);
	}
}