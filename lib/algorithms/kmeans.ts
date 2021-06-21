import { updateCentersListAction, updateDataListAction } from "../../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction } from "../../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../../redux/states-and-actions/actions";
import { store } from "../../redux/store";
import { Settings } from "../enums";
import { Point } from "../Point";
import { Utility } from "../utility";

export namespace KMeans {
    // clusterId -> Array of indexes of data
    let currClusters: Map<number, number[]> = new Map<number, number[]>();
    let prevClusters: Map<number, number[]> = new Map<number, number[]>();

    let data: Point[] = [];
    let centroids: Point[] = [];

    let currDataIdx: number = 0;
    let currCentroidIdx: number = 0;
    let percentage: number = 0;

    const resetBoard = () => {
        let currData: Point[] = store.getState().canvas.Data;
        let currCentroids: Point[] = store.getState().canvas.Centers;

        Utility.clearBoard();
        currData.forEach((datum) => {
            datum.color = Settings.White;
            Utility.drawData(datum.x, datum.y, datum.color);
        });

        currCentroids.forEach((centroid) => {
            Utility.drawCenter(centroid.x, centroid.y, centroid.color);
        });

        store.dispatch<ACanvas>(updateDataListAction(currData));
        store.dispatch<ACanvas>(updateCentersListAction(currCentroids));

        // setup
        data = currData;
        centroids = currCentroids;
        currClusters = new Map<number, number[]>();
        prevClusters = new Map<number, number[]>();
        currDataIdx = 0;
        currCentroidIdx = 0;
        percentage = 0;

        for (let i = 0; i < centroids.length; i++) {
            currClusters.set(i, []);
        }
    }

    export const generatorRandomData = () => {
        const count: number = store.getState().controller.DataCount;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let newData: Point[] = [];

        Utility.clearBoard();

        for (let i = 0; i < count; i++) {
            let datum: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, Settings.White);

            newData.push(datum);
            Utility.drawData(datum.x, datum.y, datum.color);
        }

        const currCentroids: Point[] = store.getState().canvas.Centers;
        currCentroids.forEach((centroid) => {
            Utility.drawCenter(centroid.x, centroid.y, centroid.color);
        });

        store.dispatch<ACanvas>(updateDataListAction(newData));
    }

    export const generateRandomCentroids = () => {
        const count: number = store.getState().controller.CentersCount;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const currData: Point[] = store.getState().canvas.Data;

        Utility.clearBoard();

        let newCentroids = [];

        currData.forEach((datum) => {
            Utility.drawData(datum.x, datum.y, datum.color);
        });

        for (let i = 0; i < count; i++) {
            let centroid: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, Utility.getHexColor());
            Utility.drawCenter(centroid.x, centroid.y, centroid.color);
            newCentroids.push(centroid);
        }

        store.dispatch<ACanvas>(updateCentersListAction(newCentroids));
    }

    export const addCentroid = (e: MouseEvent) => {
        const currCentroids: Point[] = store.getState().canvas.Centers;
        if (currCentroids.length >= Settings.MaxCenterLimit) {
            Utility.displayToast(`The max centroid limit is ${Settings.MaxCenterLimit}!`, true);
            return;
        }

        const { x, y } = Utility.getClickCoordinates(e);

        const centroid: Point = new Point(x, y, Utility.getHexColor());
        Utility.drawCenter(centroid.x, centroid.y, centroid.color);

        const newCentroids: Point[] = [...currCentroids, centroid];
        store.dispatch<ACanvas>(updateCentersListAction(newCentroids));
        store.dispatch<AController>(updateCentersCountAction(newCentroids.length));
    }

    export const removePoint = (e: MouseEvent) => {
        const currData: Point[] = store.getState().canvas.Data;
        const currCentroids: Point[] = store.getState().canvas.Centers;
        const { x, y } = Utility.getClickCoordinates(e);
        const { index, isCenter } = Utility.getClickedPoint(x, y, currData, currCentroids);

        if (index === -1) {
            return;
        }

        let newData: Point[] = currData;
        let newCentroids: Point[] = currCentroids;

        if (isCenter) {
            newCentroids.splice(index, 1);
        } else {
            newData.splice(index, 1);
        }

        Utility.clearBoard();
        for (let i = 0; i < newData.length; i++) {
            Utility.drawData(newData[i].x, newData[i].y, newData[i].color);
        }

        for (let j = 0; j < newCentroids.length; j++) {
            Utility.drawCenter(newCentroids[j].x, newCentroids[j].y, newCentroids[j].color);
        }

        store.dispatch<AController>(updateCentersCountAction(newCentroids.length));
        store.dispatch<ACanvas>(updateCentersListAction(newCentroids));
        store.dispatch<AController>(updateDataCountAction(newData.length));
        store.dispatch<ACanvas>(updateDataListAction(newData));
    }

    const assignCluster = (datum: Point, datumIdx: number) => {
        let minDistance: number = Infinity;
        let clusterId: number = -1;

        centroids.forEach((centroid, idx) => {
            let uDistance: number = Utility.euclideanDistance(datum, centroid);
            if (uDistance < minDistance) {
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

        if (cluster.length === 0) {
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
        for (let i = 0; i < currClusters.size; i++) {
            const currCluster = currClusters.get(i) as number[];
            const prevCluster = prevClusters.get(i) as number[];

            if (JSON.stringify(currCluster) !== JSON.stringify(prevCluster)) {
                return false;
            }
        }

        return true;
    }

    const animateCentroidMovement = () => {
        if (currCentroidIdx < centroids.length) {
            const { centerX, centerY } = clusterCenterCoordinates();
            let x: number = centroids[currCentroidIdx].x * (1.0 - percentage) + centerX * percentage;
            let y: number = centroids[currCentroidIdx].y * (1.0 - percentage) + centerY * percentage;

            if (percentage <= 1) {
                percentage += Settings.Increment;

                Utility.clearBoard();
                data.forEach((datum) => {
                    Utility.drawData(datum.x, datum.y, datum.color);
                });

                Utility.drawCenter(x, y, centroids[currCentroidIdx].color);
                centroids.forEach((centroid, idx) => {
                    if (idx !== currCentroidIdx) {
                        Utility.drawCenter(centroid.x, centroid.y, centroid.color);
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
                Utility.displayToast("K Means completed!");
                store.dispatch<ACanvas>(updateDataListAction(data));
                store.dispatch<ACanvas>(updateCentersListAction(centroids));
                Utility.enableButtons();
            } else {
                currCentroidIdx = 0;
                percentage = 0;
                prevClusters = currClusters;
                currClusters = new Map<number, number[]>();
                for (let i = 0; i < centroids.length; i++) {
                    currClusters.set(i, []);
                }
                requestAnimationFrame(animateClusterAssignment);
            }
        }
    }

    const animateClusterAssignment = () => {
        if (currDataIdx < data.length) {
            assignCluster(data[currDataIdx], currDataIdx);
            Utility.clearBoard();

            data.forEach((datum) => {
                Utility.drawData(datum.x, datum.y, datum.color);
            });

            centroids.forEach((centroid) => {
                Utility.drawCenter(centroid.x, centroid.y, centroid.color);
            });

            currDataIdx++;
            requestAnimationFrame(animateClusterAssignment);
        } else {
            currDataIdx = 0;
            requestAnimationFrame(animateCentroidMovement);
        }
    }

    export const init = () => {
        // check input
        let dataCount: number = store.getState().controller.DataCount;
        if (!dataCount) {
            Utility.displayToast("Please add data!", true);
            return;
        }
        
        let centroidsCount: number = store.getState().controller.CentersCount;
        if (!centroidsCount) {
            Utility.displayToast("Please add centroids!", true);
            return;
        }

        // reset board
        resetBoard();

        // disable buttons
        Utility.disableButtons();

        animateClusterAssignment();
    }
}