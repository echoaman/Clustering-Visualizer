export class Point {
    /**
     * @param {number} x  
     * @param {number} y 
     * @param {string} color
     * @param {boolean} [isCentroid=false] 
     * @param {number} [cluster=-1] Id of the cluster this point belongs to
     */
    constructor(x, y, color, isCentroid = false, cluster = -1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isCentroid = isCentroid;
        this.cluster = cluster;
    }
}

