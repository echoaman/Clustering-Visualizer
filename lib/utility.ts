import { updateCentersListAction, updateDataListAction } from "../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction, updateSecondaryControlAction } from "../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../redux/states-and-actions/actions";
import { store } from "../redux/store";
import { addCentroid, generateRandomCentroids } from "./algorithms/kmeans";
import { Algos, SecondaryControlButtons } from "./enums";
import { Point } from "./Point";

export const radius = 5;
export const white = "#fff";
export const black = "#000";

/**
 * Removes all drawings from the canvas
 */
export const clearBoard = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Clears canvas and redraws data and center points in their default state
 */
export const resetBoard = () => {
    clearBoard();
    const data = store.getState().canvas.Data;
    const centers = store.getState().canvas.Centers;

    data.forEach((data) => {
        drawData(data);
    });

    centers.forEach((center) => {
        drawCenter(center);
    });
}

export const drawCenter = (center: Point) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    let rotation = Math.PI / 2 * 3;
    let x = center.x;
    let y = center.y;
    let step = Math.PI / 5;

    context!.beginPath();
    context!.moveTo(center.x, center.y - radius);

    for (let i = 0; i < 5; i++) {
        x = center.x + Math.cos(rotation) * radius;
        y = center.y + Math.sin(rotation) * radius;
        context!.lineTo(x, y);
        rotation += step;

        x = center.x + Math.cos(rotation) * 2;
        y = center.y + Math.sin(rotation) * 2;
        context!.lineTo(x, y);
        rotation += step;
    }

    context!.lineTo(center.x, center.y - radius);
    context!.closePath();
    context!.lineWidth = 1;
    context!.strokeStyle = black;
    context!.stroke();
    context!.fillStyle = center.color;
    context!.fill();
}


export const drawData = (data: Point) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    context!.beginPath();
    context!.arc(data.x, data.y, radius, 0, Math.PI * 2, false);
    context!.lineWidth = 1;
    context!.strokeStyle = white;
    context!.stroke();
    context!.fillStyle = data.color;
    context!.fill();
}

export const generateRandomData = () => {
    const count = store.getState().controller.DataCount;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let newData = <Point[]>[];

    clearBoard();

    for(let i = 0 ; i < count ; i++) {
        let data = new Point(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, white);

        newData.push(data);
        drawData(data);
    }

    const centers: Point[] = store.getState().canvas.Centers;
    for(let j = 0 ; j < centers.length ; j++) {
        drawCenter(centers[j]);
    }

    store.dispatch<ACanvas>(updateDataListAction(newData));
}

export const generateColor = () => {
    let color = "#";
    let palette = "0123456789abcdef";
    while (color.length < 7)
        color += palette[Math.floor(Math.random() * palette.length)];

    return color;
}

export const generateRandomCenters = () => {
    const algo = store.getState().algorithms.SelectedAlgorithm;
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

    const x = e.x - canvas.getBoundingClientRect().x;
    const y = e.y - canvas.getBoundingClientRect().y;

    return { x, y };
}

const getClickedPoint = (x: number, y: number, data: Point[], centers: Point[]) => {
    let minDist = radius;
    let index = -1;
    let isCenter = false;

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
    const data = store.getState().canvas.Data;
    const { x, y } = getClickCoordinates(e);

    const dataPoint = new Point(x, y, white);
    drawData(dataPoint);

    const newData = [...data, dataPoint];
    store.dispatch<ACanvas>(updateDataListAction(newData));
    store.dispatch<AController>(updateDataCountAction(newData.length));
}


const addCenter = (e: MouseEvent) => {
    const algo = store.getState().algorithms.SelectedAlgorithm;
    switch (algo) {
        case Algos.Kmeans:
            addCentroid(e);
            break;
    
        default:
            break;
    }
}

const removePoint = (e: MouseEvent) => {
    const data = store.getState().canvas.Data;
    const centers = store.getState().canvas.Centers;
    const { x, y } = getClickCoordinates(e);

    const { index, isCenter } = getClickedPoint(x, y, data, centers);

    if(index === -1) {
        return;
    }
    
    let newData = data;
    let newCenters = centers;

    if(isCenter) {
        newCenters.splice(index, 1);
    } else {
        newData.splice(index, 1);
    }

    clearBoard();
    for(let i = 0 ; i < newData.length ; i++) {
        drawData(newData[i]);
    }

    for(let j = 0 ; j < newCenters.length ; j++) {
        drawCenter(newCenters[j]);
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