import { updateCentersListAction, updateDataListAction } from "../../redux/action-creators/canvasActions";
import { updateCentersCountAction } from "../../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../../redux/states-and-actions/actions";
import { store } from "../../redux/store";
import { Settings } from "../enums";
import { Point } from "../Point";
import { clearBoard, disableButtons, drawCenter, drawData, enableButtons, generateColor, getClickCoordinates, resetBoard } from "../utility";

// clusterId -> Array of indexes of data
let currClusters: Map<number, number[]> = new Map<number, number[]>();
let prevClusters: Map<number, number[]> = new Map<number, number[]>();

let data: Point[] = <Point[]>[];
let centroids: Point[] = <Point[]>[];

let currDataIdx: number = 0;
let currCentroidIdx: number = 0;
let percentage: number = 0;

export const generateRandomCentroids = () => {
    const count: number = store.getState().controller.CentersCount;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const currData: Point[] = store.getState().canvas.Data;

    clearBoard();

    let newCentroids = <Point[]>[];

    currData.forEach((datum) => {
        drawData(datum.x, datum.y, datum.color);
    });

    for(let i = 0 ; i < count ; i++) {
        let centroid: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, generateColor());
        drawCenter(centroid.x, centroid.y, centroid.color);
        newCentroids.push(centroid);
    }

    store.dispatch<ACanvas>(updateCentersListAction(newCentroids));
}

export const addCentroid = (e: MouseEvent) => {
    const currCentroids: Point[] = store.getState().canvas.Centers;
    if(currCentroids.length >= Settings.MaxCenterLimit) {
        alert(`The max centroid limit ${Settings.MaxCenterLimit}!`);
        return;
    }
    
    const { x, y } = getClickCoordinates(e);

    const centroid: Point = new Point(x, y, generateColor());
    drawCenter(centroid.x, centroid.y, centroid.color);

    const newCentroids: Point[] = [...currCentroids, centroid];
    store.dispatch<ACanvas>(updateCentersListAction(newCentroids));
    store.dispatch<AController>(updateCentersCountAction(newCentroids.length));
}

const euclideanDistance = (pointA: Point, pointB: Point) => {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

const assignCluster = (datum: Point, datumIdx: number) => {
    let minDistance: number = Infinity;
    let clusterId: number = -1;

    centroids.forEach((centroid, idx) => {
        let uDistance: number = euclideanDistance(datum, centroid);
        if(uDistance < minDistance) {
            minDistance = uDistance;
            clusterId = idx;
        }
    });

    datum.color = centroids[clusterId].color;
    currClusters.get(clusterId)!.push(datumIdx);
}

// returns coordinates of center of the cluster
const clusterCenterCoordinates = () => {
    const cluster = currClusters.get(currCentroidIdx) as number[];
    let centerX: number = 0;
    let centerY: number = 0;

    if(cluster.length === 0) {
        const centroid = centroids[currCentroidIdx];
        return {
            centerX: centroid.x,
            centerY: centroid.y
        };
    }

    cluster.forEach((idx) => {
        centerX += data[idx].x;
        centerY += data[idx].y;
    });

    centerX /= cluster.length;
    centerY /= cluster.length;

    return { centerX, centerY };
}

const compareCurrAndPrevClusters = () => {
    for(let i = 0 ; i < currClusters.size ; i++) {
        const currCluster = currClusters.get(i) as number[];
        const prevCluster = prevClusters.get(i) as number[];

        if(JSON.stringify(currCluster) !== JSON.stringify(prevCluster)) {
            return false;
        }
    }

    return true;
}

const animateCentroidMovement = () => {
    if(currCentroidIdx < centroids.length) {
        const { centerX, centerY } = clusterCenterCoordinates();
        let x: number = centroids[currCentroidIdx].x * (1.0 - percentage) + centerX * percentage;
        let y: number = centroids[currCentroidIdx].y * (1.0 - percentage) + centerY * percentage;
        
        if(percentage <= 1) {
            percentage += Settings.Increment;

            clearBoard();
            data.forEach((datum) => {
                drawData(datum.x, datum.y, datum.color);
            });

            drawCenter(x, y, centroids[currCentroidIdx].color);
            centroids.forEach((centroid, idx) => {
                if(idx !== currCentroidIdx) {
                    drawCenter(centroid.x, centroid.y, centroid.color);
                }
            });
        } else {
            percentage = 0;
            centroids[currCentroidIdx].x = x;
            centroids[currCentroidIdx].y = y;
            currCentroidIdx++;
        }
        requestAnimationFrame(animateCentroidMovement);
    } else {
        if (compareCurrAndPrevClusters()) {
            alert("K means completed!");
            store.dispatch<ACanvas>(updateDataListAction(data));
            store.dispatch<ACanvas>(updateCentersListAction(centroids));
            enableButtons();
        } else {
            currCentroidIdx = 0;
            percentage = 0;
            prevClusters = currClusters;
            currClusters = new Map<number, number[]>();
            for(let i = 0 ; i < centroids.length ; i++) {
                currClusters.set(i, []);
            }
            requestAnimationFrame(animateClusterAssignment);
        }
    }
}

const animateClusterAssignment = () => {
    if(currDataIdx < data.length) {
        assignCluster(data[currDataIdx], currDataIdx);
        clearBoard();

        data.forEach((datum) => {
            drawData(datum.x, datum.y, datum.color);
        });

        centroids.forEach((centroid) => {
            drawCenter(centroid.x, centroid.y, centroid.color);
        });

        currDataIdx++;
        requestAnimationFrame(animateClusterAssignment);
    }else{
        currDataIdx = 0;
        requestAnimationFrame(animateCentroidMovement);
    }
}

export const kmeans = () => {
    // check input
    let dataCount: number = store.getState().controller.DataCount;
    if(!dataCount) {
        alert("Please add data!");
        return;
    }

    let centroidsCount: number = store.getState().controller.CentersCount;
    if(!centroidsCount) {
        alert("Please add centroids!");
        return;
    }
    
    // reset board
    resetBoard();

    // setup
    data = store.getState().canvas.Data;
    centroids = store.getState().canvas.Centers;
    currClusters = new Map<number, number[]>();
    prevClusters = new Map<number, number[]>();
    currDataIdx = 0;
    currCentroidIdx = 0;
    percentage = 0;

    for(let i = 0 ; i < centroids.length ; i++) {
        currClusters.set(i, []);
    }

    // disable buttons
    disableButtons();

    animateClusterAssignment();
}