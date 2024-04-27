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