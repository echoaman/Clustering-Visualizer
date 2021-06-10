export class Point {
    /**
     * @param {number} x  
     * @param {number} y 
     * @param {string} color
     * @param {boolean} isCentroid 
     */
    constructor(x, y, color, isCentroid = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isCentroid = isCentroid;
    }
}

