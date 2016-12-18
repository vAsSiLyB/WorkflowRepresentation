Object.defineProperty(Array.prototype, 'members', {
	writable : true,
	value : 0
});
Object.defineProperty(Array.prototype, 'sum', {
	writable : true,
	value : 0
});
Object.defineProperty(Array.prototype, 'sumSquares', {
	writable : true,
	value : 0
});
Object.defineProperty(Array.prototype, 'md', {
	writable : true,
	value : undefined
});
Object.defineProperty(Array.prototype, 'avg', {
	writable : true,
	value : undefined
});
Object.defineProperty(Array.prototype, 'rms', {
	writable : true,
	value : undefined
});
Object.defineProperty(Array.prototype, 'average', {
	writable : false,
	value : function (newValue) {
		if (typeof newValue !== 'undefined') {
			this.sum += newValue;
		}
		this.avg = this.sum / this.members || this.length;
	}
});
Object.defineProperty(Array.prototype, 'sortNumeric', {
	writable : false,
	value : function () {
		function compareNumbers(a, b) {
			return a - b;
		}
		this.sort(compareNumbers);
	}
});
Object.defineProperty(Array.prototype, 'median', {
	writable : false,
	value : function(value) {
		if (typeof value === 'undefined') {
			this.sortNumeric();
			this.md = this[Math.floor(this.length / 2)];
		}
		else
			this.md = value;
	}
});
Object.defineProperty(Array.prototype, 'rmsCompute', {
	writable : false,
	value : function (newValue) {
		if (typeof newValue !== 'undefined') {
			this.push(newValue);
			this.sum += newValue;
		}
		this.sumSquares = 0;
		if (typeof this.avg !== 'undefined') {
			for (var i = 0; i < this.length; i++) {
				this.sumSquares += Math.pow(this[i] - this.avg, 2);
			}
		}
		else
			console.error('Array Exception : rms Compute without defining average value');
		this.rms = Math.sqrt(this.sumSquares / this.members || this.length);
	}
});