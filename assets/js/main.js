document.addEventListener("DOMContentLoaded", function () {
	new SweetScroll({});

	// Find the particles-js container and add canvas there
	const particlesContainer = document.getElementById('particles-js');
	let canvas = document.createElement('canvas');
	canvas.id = 'automaton-bg';
	canvas.style.position = 'absolute';
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.zIndex = '0';
	canvas.style.pointerEvents = 'none';
	
	// Insert canvas as the first child of particles-js container
	if (particlesContainer) {
		particlesContainer.insertBefore(canvas, particlesContainer.firstChild);
	} else {
		// Fallback: add to body if particles-js not found
		canvas.style.position = 'fixed';
		canvas.style.width = '100vw';
		canvas.style.height = '100vh';
		canvas.style.zIndex = '-1';
		document.body.appendChild(canvas);
	}
	// Adjust canvas size on resize
	function resizeCanvas() {
		if (particlesContainer) {
			canvas.width = particlesContainer.offsetWidth;
			canvas.height = particlesContainer.offsetHeight;
		} else {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	}
	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();

	// Conway's Game of Life implementation
	const ctx = canvas.getContext('2d');
	const cellSize = 8;
	let cols, rows, grid, next;

	function initGrid() {
		cols = Math.floor(canvas.width / cellSize);
		rows = Math.floor(canvas.height / cellSize);
		grid = Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0)) // Reduced density for better visibility
		);
		next = Array.from({ length: rows }, () => Array(cols).fill(0));
	}

	function drawGrid() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Set a subtle background
		ctx.fillStyle = 'rgba(26, 34, 44, 0.3)'; // Semi-transparent dark blue
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Draw live cells
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x]) {
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}
	}

	function updateGrid() {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				let neighbors = 0;
				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						if (i === 0 && j === 0) continue;
						let ny = y + i;
						let nx = x + j;
						if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
							neighbors += grid[ny][nx];
						}
					}
				}
				if (grid[y][x] && (neighbors === 2 || neighbors === 3)) {
					next[y][x] = 1;
				} else if (!grid[y][x] && neighbors === 3) {
					next[y][x] = 1;
				} else {
					next[y][x] = 0;
				}
			}
		}
		// Swap grids
		[grid, next] = [next, grid];
	}

	let lastUpdateTime = 0;
	const updateInterval = 150; // Update every 150ms

	function animate(currentTime) {
		if (currentTime - lastUpdateTime >= updateInterval) {
			drawGrid();
			updateGrid();
			lastUpdateTime = currentTime;
		}
		requestAnimationFrame(animate);
	}

	initGrid();
	animate();
	window.addEventListener('resize', () => {
		resizeCanvas();
		initGrid();
	});
});
