export class Point {
    x: number;
    y: number;
    color: string;
    isCenter: boolean;  // Used for centroid, medoid or core

    constructor(x: number, y: number, color: string, isCenter: boolean = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isCenter = isCenter;
    }
}