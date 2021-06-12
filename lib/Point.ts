export class Point {
    x: number;
    y: number;
    color: string;
    isCenter: boolean;
    cluster: number;
    
    /**
     * @param isCenter Default = false
     * @param cluster Id of the cluster the point belongs to; Default = -1
     */
    constructor(x: number, y: number, color: string, isCenter: boolean = false, cluster: number = -1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isCenter = isCenter;
        this.cluster = cluster;
    }
}