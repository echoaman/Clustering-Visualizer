export class Point {
    x: number;
    y: number;
    color: string;
    isMedoid: boolean;

    constructor(x: number, y: number, color: string, isMedoid: boolean = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isMedoid = isMedoid;
    }
}