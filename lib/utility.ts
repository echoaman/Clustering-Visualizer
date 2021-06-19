import { appRunningToggle, updateSelectedAlgorithm } from "../redux/action-creators/algorithmActions";
import { updateCentersListAction, updateDataListAction } from "../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction, updateSecondaryControlAction } from "../redux/action-creators/controllerActions";
import { AAlgorithms, ACanvas, AController } from "../redux/states-and-actions/actions";
import { store } from "../redux/store";
import { Dbscan } from "./algorithms/dbscan";
import { KMeans } from "./algorithms/kmeans";
import { KMedoids } from "./algorithms/kmedoids";
import { Algos, SecondaryControlButtons, Settings } from "./enums";
import { Point } from "./Point";

export namespace Utility {
    export const clearBoard = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    export const drawCenter = (centerX: number, centerY: number, color: string) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        let rotation: number = Math.PI / 2 * 3;
        let x: number = centerX;
        let y: number = centerY;
        let step: number = Math.PI / 5;

        context.beginPath();
        context.moveTo(centerX, centerY - Settings.Radius);

        for (let i = 0; i < 5; i++) {
            x = centerX + Math.cos(rotation) * Settings.Radius;
            y = centerY + Math.sin(rotation) * Settings.Radius;
            context.lineTo(x, y);
            rotation += step;

            x = centerX + Math.cos(rotation) * 2;
            y = centerY + Math.sin(rotation) * 2;
            context.lineTo(x, y);
            rotation += step;
        }

        context.lineTo(centerX, centerY - Settings.Radius);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = Settings.Black;
        context.stroke();
        context.fillStyle = color;
        context.fill();
    }

    export const drawData = (dataX: number, dataY: number, color: string) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        context.beginPath();
        context.arc(dataX, dataY, Settings.Radius, 0, Math.PI * 2, false);
        context.lineWidth = 1;
        context.strokeStyle = Settings.White;
        context.stroke();
        context.fillStyle = color;
        context.fill();
    }

    export const drawCircle = (x: number, y: number, color: string) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        const epsilon: number = store.getState().controller.Neighbourhood;

        context.beginPath();
        context.fillStyle = getRgbaColor(color, 0.2);
        context.arc(x, y, epsilon, 0, Math.PI * 2, false);
        context.fill();
    }

    export const generateRandomData = () => {
        const algo: Algos = store.getState().algorithms.SelectedAlgorithm;
        switch (algo) {
            case Algos.Kmeans:
                KMeans.generatorRandomData();
                break;

            case Algos.Kmedoids:
                KMedoids.generateRandomData();
                break;

            case Algos.Dbsacn:
                Dbscan.generateRandomData();
                break;
            default:
                break;
        }
    }

    export const generateRandomCenters = () => {
        const algo: Algos = store.getState().algorithms.SelectedAlgorithm;
        switch (algo) {
            case Algos.Kmeans:
                KMeans.generateRandomCentroids();
                break;

            case Algos.Kmedoids:
                KMedoids.generateRandomMedoids();
                break;
            default:
                break;
        }
    }

    // min and max included
    export const randomIntInRange = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    export const getHexColor = () => {
        let color: string = "#";
        let options: string = "23456789abcd";
        while (color.length < 7)
            color += options[randomIntInRange(0, options.length - 1)];

        return color;
    }

    const getRgbaColor = (color: string, opacity: number) => {
        let r: number = parseInt(color.substring(1, 3), 16);
        let g: number = parseInt(color.substring(3, 5), 16);
        let b: number = parseInt(color.substring(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    export const getClickCoordinates = (e: MouseEvent) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const x: number = e.x - canvas.getBoundingClientRect().x;
        const y: number = e.y - canvas.getBoundingClientRect().y;

        return { x, y };
    }

    export const getClickedPoint = (x: number, y: number, data: Point[], centers: Point[] = []) => {
        let minDist: number = Settings.Radius;
        let index: number = -1;
        let isCenter: boolean = false;

        for (let i = 0; i < data.length; i++) {
            let dist = Math.sqrt(Math.pow(x - data[i].x, 2) + Math.pow(y - data[i].y, 2));
            if (dist <= minDist) {
                index = i;
                isCenter = false;
                minDist = dist;
            }
        }

        for (let i = 0; i < centers.length; i++) {
            let dist = Math.sqrt(Math.pow(x - centers[i].x, 2) + Math.pow(y - centers[i].y, 2));
            if (dist <= minDist) {
                index = i;
                isCenter = true;
                minDist = dist;
            }
        }

        return {
            index,
            isCenter
        };
    }

    const addData = (e: MouseEvent) => {
        const data: Point[] = store.getState().canvas.Data;
        if (data.length >= Settings.MaxDataLimit) {
            alert(`The max data limit is ${Settings.MaxDataLimit}!`);
            return;
        }

        const { x, y } = getClickCoordinates(e);

        const dataPoint: Point = new Point(x, y, Settings.White);
        drawData(dataPoint.x, dataPoint.y, dataPoint.color);

        const newData: Point[] = [...data, dataPoint];
        store.dispatch<ACanvas>(updateDataListAction(newData));
        store.dispatch<AController>(updateDataCountAction(newData.length));
    }


    const addCenter = (e: MouseEvent) => {
        const algo: Algos = store.getState().algorithms.SelectedAlgorithm;
        switch (algo) {
            case Algos.Kmeans:
                KMeans.addCentroid(e);
                break;
            case Algos.Kmedoids:
                KMedoids.addMedoid(e);
                break;
            default:
                break;
        }
    }

    const removePoint = (e: MouseEvent) => {
        const algo: Algos = store.getState().algorithms.SelectedAlgorithm;

        switch (algo) {
            case Algos.Kmeans:
                KMeans.removePoint(e);
                break;

            case Algos.Kmedoids:
                KMedoids.removePoint(e);
                break;

            case Algos.Dbsacn:
                Dbscan.removePoint(e);
                break;

            default:
                break;
        }
    }

    const removeCanvasClickEvents = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.removeEventListener("click", addData, false);
        canvas.removeEventListener("click", addCenter, false);
        canvas.removeEventListener("click", removePoint, false);
        store.dispatch<AController>(updateSecondaryControlAction(SecondaryControlButtons.None));
    }

    export const changeCanvasClickEvent = (ctrlId: SecondaryControlButtons) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        removeCanvasClickEvents();
        store.dispatch<AController>(updateSecondaryControlAction(ctrlId));

        switch (ctrlId) {
            case SecondaryControlButtons.AddData:
                canvas.addEventListener("click", addData, false);
                break;

            case SecondaryControlButtons.AddCenter:
                canvas.addEventListener("click", addCenter, false);
                break;

            case SecondaryControlButtons.RemovePoint:
                canvas.addEventListener("click", removePoint, false);
                break;

            default:
                removeCanvasClickEvents();
                break;
        }
    }

    export const disableButtons = () => {
        removeCanvasClickEvents();
        store.dispatch<AAlgorithms>(appRunningToggle());
    }

    export const enableButtons = () => {
        removeCanvasClickEvents();
        store.dispatch<AAlgorithms>(appRunningToggle());
    }

    export const startAlgo = () => {
        const algo: Algos = store.getState().algorithms.SelectedAlgorithm;

        switch (algo) {
            case Algos.Kmeans:
                KMeans.init();
                break;

            case Algos.Kmedoids:
                KMedoids.init();
                break;

            case Algos.Dbsacn:
                Dbscan.init();
                break;

            default:
                alert("Select algorithm!");
                break;
        }
    }

    export const handleAlgoChange = (algoId: Algos) => {
        store.dispatch<ACanvas>(updateCentersListAction());
        store.dispatch<AController>(updateCentersCountAction());
        store.dispatch<AAlgorithms>(updateSelectedAlgorithm(algoId));
        removeCanvasClickEvents();

        let data: Point[] = store.getState().canvas.Data;
        clearBoard();
        data.forEach((datum) => {
            datum.color = Settings.White;
            datum.isCenter = false;
            drawData(datum.x, datum.y, datum.color);
        });

        store.dispatch<ACanvas>(updateDataListAction(data));
    }

    export const euclideanDistance = (pointA: Point, pointB: Point) => {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
    }

    export const manhattanDistance = (pointA: Point, pointB: Point): number => {
        return (Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y));
    }
}