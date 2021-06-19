import { updateCentersListAction, updateDataListAction } from "../../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction } from "../../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../../redux/states-and-actions/actions";
import { store } from "../../redux/store"
import { Settings } from "../enums";
import { Point } from "../Point";
import { Utility } from "../utility";

export namespace KMedoids {
    let distanceMatrix: number[][] = [];
    let data: Point[] = [];
    let currMedoidIdxs: number[] = [];
    let prevMedoidIdx: number[] = [];
    let clusters: Map<number, number[]> = new Map<number, number[]>();
    let totalCost: number = Infinity;
    let currDataIdx: number = 0;

    const drawPoints = (currData: Point[] = data) => {
        const currMedoids: Point[] = currData.filter((datum) => datum.isCenter);

        currData.forEach((datum) => {
            const { x, y, color, isCenter } = datum;
            if (!isCenter) {
                Utility.drawData(x, y, color);
            }
        });

        currMedoids.forEach((medoid) => {
            const { x, y, color } = medoid;
            Utility.drawCenter(x, y, color);
        });
    }

    export const generateRandomData = () => {
        const count: number = store.getState().controller.DataCount;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let newData: Point[] = [];

        Utility.clearBoard();

        for (let i = 0; i < count; i++) {
            let datum: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, Settings.White);

            newData.push(datum);
            Utility.drawData(datum.x, datum.y, datum.color);
        }

        store.dispatch<ACanvas>(updateDataListAction(newData));
        store.dispatch<ACanvas>(updateCentersListAction());
        store.dispatch<AController>(updateCentersCountAction());
    }

    export const generateRandomMedoids = () => {
        let count: number = store.getState().controller.CentersCount;
        let currData: Point[] = store.getState().canvas.Data;

        currData.forEach((datum) => {
            datum.color = Settings.White;
            datum.isCenter = false;
        });

        while (count) {
            let datum: Point = currData[Utility.randomIntInRange(0, currData.length - 1)];
            if (!datum.isCenter) {
                datum.color = Utility.getHexColor();
                datum.isCenter = true;
                count--;
            }
        }

        Utility.clearBoard();
        drawPoints(currData);

        store.dispatch<ACanvas>(updateDataListAction(currData));
    }

    export const addMedoid = (e: MouseEvent) => {
        let currData: Point[] = store.getState().canvas.Data;
        const medoidsCount: number = store.getState().controller.CentersCount;
        if (medoidsCount >= Math.min(currData.length, Settings.MaxCenterLimit)) {
            alert(`The current max medoid limit is ${Math.min(currData.length, Settings.MaxCenterLimit)}!`);
            return;
        }

        const { x, y } = Utility.getClickCoordinates(e);
        const { index, isCenter } = Utility.getClickedPoint(x, y, currData);

        if (index === -1) {
            return;
        }

        if (currData[index].isCenter) {
            return;
        }

        currData[index].isCenter = true;
        currData[index].color = Utility.getHexColor();

        Utility.clearBoard();
        drawPoints(currData);

        store.dispatch<ACanvas>(updateDataListAction(currData));
        store.dispatch<AController>(updateCentersCountAction(medoidsCount + 1));
    }

    export const removePoint = (e: MouseEvent) => {
        const currData: Point[] = store.getState().canvas.Data;
        const { x, y } = Utility.getClickCoordinates(e);
        const { index, isCenter } = Utility.getClickedPoint(x, y, currData);

        if (index === -1) {
            return;
        }

        let newData = currData;
        const point: Point = newData.splice(index, 1)[0];
        store.dispatch<ACanvas>(updateDataListAction(newData));
        store.dispatch<AController>(updateDataCountAction(newData.length));

        if (point.isCenter) {
            const medoidsCount: number = store.getState().controller.CentersCount;
            store.dispatch<AController>(updateCentersCountAction(medoidsCount - 1));
        }

        Utility.clearBoard();
        drawPoints(newData);
    }

    const resetBoard = () => {
        let currData: Point[] = store.getState().canvas.Data;

        currData.forEach((datum) => {
            if (!datum.isCenter) {
                datum.color = Settings.White;
            }
        });

        store.dispatch<ACanvas>(updateDataListAction(currData));

        Utility.clearBoard();
        drawPoints(currData);

        // setup
        data = currData;
        currMedoidIdxs = [];
        for (let i = 0; i < currData.length; i++) {
            if (currData[i].isCenter) {
                currMedoidIdxs.push(i);
            }
        }

        distanceMatrix = [];
        totalCost = Infinity;
        currDataIdx = 0;
        clusters = new Map<number, number[]>();

        makeDistanceMatrix();
    }

    const makeDistanceMatrix = () => {
        for (let i = 0; i < data.length; i++) {
            let dist: number[] = [];
            for (let j = 0; j < data.length; j++) {
                dist.push(Utility.manhattanDistance(data[i], data[j]));
            }
            distanceMatrix.push(dist);
        }
    }

    const findNewMedoid = (medoid: number, cluster: number[]): number => {
        if (cluster.length === 0) {
            return medoid;
        }

        let minDist = Infinity;
        let idx = -1;

        for (let i = 0; i < cluster.length; i++) {
            let dist = 0;
            for (let j = 0; j < cluster.length; j++) {
                if (i !== j) {
                    dist += distanceMatrix[cluster[i]][cluster[j]];
                }
            }
            dist += distanceMatrix[cluster[i]][medoid];
            dist /= cluster.length;
            if (dist < minDist) {
                minDist = dist;
                idx = i;
            }
        }

        return cluster[idx];
    }

    const findNewMedoids = () => {
        let newMedoids: number[] = [];
        let keys: number[] = Array.from(clusters.keys());
        for (let i = 0; i < keys.length; i++) {
            let currCluster = clusters.get(keys[i]) as number[];
            let newMedoid = findNewMedoid(keys[i], currCluster);
            newMedoids.push(newMedoid);
        }
        prevMedoidIdx = currMedoidIdxs;
        currMedoidIdxs = newMedoids;
        evaluateCost();
    }

    const getCluster = (): number => {
        let keys: number[] = Array.from(clusters.keys());
        let idx: number = -1;
        for (let i = 0; i < keys.length; i++) {
            const cluster = clusters.get(keys[i]);
            idx = cluster!.indexOf(currDataIdx);
            if (idx !== -1) {
                idx = keys[i];
                break;
            }
        }

        return idx === -1 ? currDataIdx : idx;
    }

    const animate = () => {
        if (currDataIdx < data.length) {
            const clusterIdx: number = getCluster();
            data[currDataIdx].color = data[clusterIdx].color;

            Utility.clearBoard();
            drawPoints();

            currDataIdx++;
            requestAnimationFrame(animate);
        } else {
            currDataIdx = 0;
            findNewMedoids();
        }
    }

    const evaluateCost = () => {
        clusters = new Map<number, number[]>();
        currMedoidIdxs.forEach((idx) => {
            clusters.set(idx, []);
        })

        let tempCost: number = 0;
        for (let i = 0; i < data.length; i++) {
            if (!data[i].isCenter) {
                let dist = Infinity;
                let idx = -1;
                for (let j = 0; j < currMedoidIdxs.length; j++) {
                    const manDist = distanceMatrix[currMedoidIdxs[j]][i];
                    if (manDist < dist) {
                        dist = manDist;
                        idx = j;
                    }
                }
                clusters.get(currMedoidIdxs[idx])!.push(i);
                tempCost += dist;
            }
        }

        if (tempCost < totalCost) {
            for (let l = 0; l < data.length; l++) {
                if (currMedoidIdxs.indexOf(l) < 0) {
                    data[l].isCenter = false;
                } else {
                    data[l].isCenter = true;
                }
            }

            totalCost = tempCost;
            animate();
        } else {
            alert("K Medoids completed!");
            for (let l = 0; l < data.length; l++) {
                if (prevMedoidIdx.indexOf(l) < 0) {
                    data[l].isCenter = false;
                } else {
                    data[l].isCenter = true;
                }
            }
            store.dispatch<ACanvas>(updateDataListAction(data));
            Utility.enableButtons();
        }
    }

    export const init = () => {
        // check input
        let dataCount: number = store.getState().controller.DataCount;
        if (!dataCount) {
            alert("Please add data!");
            return;
        }

        let medoidsCount: number = store.getState().controller.CentersCount;
        if (!medoidsCount) {
            alert("Please add medoids!");
            return;
        }

        resetBoard();

        Utility.disableButtons();

        evaluateCost();
    }
}