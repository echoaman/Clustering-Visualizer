import { updateCentersListAction, updateDataListAction } from "../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction, updateSecondaryControlAction } from "../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../redux/states-and-actions/actions";
import { store } from "../redux/store";
import { addCentroid, generateRandomCentroids, kmeans } from "./algorithms/kmeans";
import { Algos, SecondaryControlButtons, Settings } from "./enums";
import { Point } from "./Point";

/**
 * Removes all drawings from the canvas
 */
export const clearBoard = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Clears canvas and redraws data and centers in their default state
 */
export const resetBoard = () => {
    clearBoard();
    const data: Point[] = store.getState().canvas.Data;
    const centers: Point[] = store.getState().canvas.Centers;

    data.forEach((data) => {
        data.color = Settings.White;
        drawData(data.x, data.y, data.color);
    });

    centers.forEach((center) => {
        drawCenter(center.x, center.y, center.color);
    });

    store.dispatch<ACanvas>(updateDataListAction(data));
    store.dispatch<ACanvas>(updateCentersListAction(centers));
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
    const context = canvas.getContext("2d") as CanvasRenderingContext2D ;

    context.beginPath();
    context.arc(dataX, dataY, Settings.Radius, 0, Math.PI * 2, false);
    context.lineWidth = 1;
    context.strokeStyle = Settings.White;
    context.stroke();
    context.fillStyle = color;
    context.fill();
}

export const generateRandomData = () => {
    const count: number = store.getState().controller.DataCount;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let newData: Point[] = <Point[]>[];

    clearBoard();

    for(let i = 0 ; i < count ; i++) {
        let data: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, Settings.White);

        newData.push(data);
        drawData(data.x, data.y, data.color);
    }

    const centers: Point[] = store.getState().canvas.Centers;
    for(let j = 0 ; j < centers.length ; j++) {
        drawCenter(centers[j].x, centers[j].y, centers[j].color);
    }

    store.dispatch<ACanvas>(updateDataListAction(newData));
}

export const generateColor = () => {
    let color: string = "#";
    let palette: string = "0123456789abcdef";
    while (color.length < 7)
        color += palette[Math.floor(Math.random() * palette.length)];

    return color;
}

export const generateRandomCenters = () => {
    const algo: Algos = store.getState().algorithms.SelectedAlgorithm;
    switch (algo) {
        case Algos.Kmeans:
            generateRandomCentroids();
            break;
    
        default:
            break;
    }
}

export const getClickCoordinates = (e: MouseEvent) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const x: number = e.x - canvas.getBoundingClientRect().x;
    const y: number = e.y - canvas.getBoundingClientRect().y;

    return { x, y };
}

const getClickedPoint = (x: number, y: number, data: Point[], centers: Point[]) => {
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
    if(data.length >= Settings.MaxDataLimit) {
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
            addCentroid(e);
            break;
    
        default:
            break;
    }
}

const removePoint = (e: MouseEvent) => {
    const data: Point[] = store.getState().canvas.Data;
    const centers: Point[] = store.getState().canvas.Centers;
    const { x, y } = getClickCoordinates(e);

    const { index, isCenter } = getClickedPoint(x, y, data, centers);

    if(index === -1) {
        return;
    }
    
    let newData: Point[] = data;
    let newCenters: Point[] = centers;

    if(isCenter) {
        newCenters.splice(index, 1);
    } else {
        newData.splice(index, 1);
    }

    clearBoard();
    for(let i = 0 ; i < newData.length ; i++) {
        drawData(newData[i].x, newData[i].y, newData[i].color);
    }

    for(let j = 0 ; j < newCenters.length ; j++) {
        drawCenter(newCenters[j].x, newCenters[j].y, newCenters[j].color);
    }

    store.dispatch<AController>(updateCentersCountAction(newCenters.length));
    store.dispatch<ACanvas>(updateCentersListAction(newCenters));
    store.dispatch<AController>(updateDataCountAction(newData.length));
    store.dispatch<ACanvas>(updateDataListAction(newData));
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

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.classList.add("disabled-btn");
        button.disabled = true;
    });

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.disabled = true;
    });

    document.getElementById("rocket")!.style.fill = "grey";
    document.getElementById("clear")!.style.fill = "grey";
}

export const enableButtons = () => {
    removeCanvasClickEvents();

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.classList.remove("disabled-btn");
        button.disabled = false;
    });

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.disabled = false;
    });

    document.getElementById("rocket")!.style.fill = "green";
    document.getElementById("clear")!.style.fill = "red";
}

export const startAlgo = () => {
    const algo: Algos = store.getState().algorithms.SelectedAlgorithm;

    switch (algo) {
        case Algos.Kmeans:
            kmeans();
            break;
    
        default:
            alert("Select algorithm!");
            break;
    }
}