import { Action_Update_Centroids, Action_Update_Data } from "../redux/actions/canvasActions";
import { Action_Update_Centroid_Count, Action_Update_Data_Count, Action_Update_Secondary_Ctrl } from "../redux/actions/controllerActions"
import { store } from "../redux/store";
import { Point } from "./Point";

const radius = 5;
const white = "#fff";
const black = "#000";

/**
 * Removes all drawings on the canvas
 */
export const clearBoard = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Clears board and draws centroids and white data
 * @param {Point[]} data 
 * @param {Point[]} centroids 
 */
export const resetBoard = (data, centroids = null) => {
    clearBoard();
    
    data.forEach((data) => {
        drawData(data);
    });

    centroids.forEach((centroid) => {
        drawCentroid(centroid);
    });
}

/**
 * @param {Point} centroid 
 */
export const drawCentroid = (centroid) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    let rot = Math.PI / 2 * 3;
    let x = centroid.x;
    let y = centroid.y;
    let step = Math.PI / 5;

    context.beginPath();
    context.moveTo(centroid.x, centroid.y - radius)
    for (let i = 0; i < 5; i++) {
        x = centroid.x + Math.cos(rot) * radius;
        y = centroid.y + Math.sin(rot) * radius;
        context.lineTo(x, y);
        rot += step;

        x = centroid.x + Math.cos(rot) * 2;
        y = centroid.y + Math.sin(rot) * 2;
        context.lineTo(x, y);
        rot += step;
    }
    context.lineTo(centroid.x, centroid.y - radius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = black;
    context.stroke();
    context.fillStyle = centroid.color;
    context.fill();
}

/**
 * @param {Point} data 
 */
export const drawData = (data) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.beginPath();
    context.arc(data.x, data.y, radius, 0, Math.PI * 2, false);
    context.lineWidth = 1;
    context.strokeStyle = white;
    context.stroke();
    context.fillStyle = data.color;
    context.fill();
}

/**
 * @param {number} count 
 */
export const generateRandomData = (count = store.getState().controller.Data_Count) => {
    const canvas = document.getElementById("canvas");
    let newData = [];

    clearBoard();

    for(let i = 0 ; i < count ; i++) {
        let data = new Point(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, white);

        newData.push(data);
        drawData(data);
    }

    const centroids = store.getState().canvas.Centroids;
    for(let j = 0 ; j < centroids.length ; j++) {
        drawCentroid(centroids[j]);
    }

    store.dispatch(Action_Update_Data(newData));
}

/**
 * @returns {string} Returns a color
 */
const generateColor = () => {
    let color = "#";
    let palette = "0123456789abcdef";
    while (color.length < 7)
        color += palette[Math.floor(Math.random() * palette.length)];

    return color;
}

/**
 * @param {number} count 
 */
export const generateRandomCentroids = (count = store.getState().controller.Centroid_Count) => {
    const canvas = document.getElementById("canvas");
    let newCentroids = [];

    clearBoard();
    
    const data = store.getState().canvas.Data;
    for(let j = 0 ; j < data.length ; j++) {
        drawData(data[j]);
    }

    for(let i = 0 ; i < count ; i++) {
        let centroid = new Point(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, generateColor(), true);
        
        newCentroids.push(centroid);
        drawCentroid(centroid);
    }

    store.dispatch(Action_Update_Centroids(newCentroids));
}

/**
 * @param {TouchEvent} e 
 * @returns {{number, number}} x and y coordinates on canvas
 */
const getClickCoodinates = (e) => {
    const canvas = document.getElementById("canvas");

    let x = e.x - canvas.getBoundingClientRect().x;
    let y = e.y - canvas.getBoundingClientRect().y;

    return { x, y };
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {Point[]} data 
 * @param {Point[]} centroids 
 * @returns {{number,boolean}} index: index of point in array or -1 if no point was clicked; isCentroid: if point clicked is centroid 
 */
const getPointToRemove = (x, y, data, centroids) => {
    let minDist = radius;
    let index = -1;
    let isCentroid = false;

    for (let i = 0; i < data.length; i++) {
        let dist = Math.sqrt(Math.pow(x - data[i].x, 2) + Math.pow(y - data[i].y, 2));
        if (dist <= minDist) {
            index = i;
            isCentroid = false;
            minDist = dist;
        }
    }

    for (let i = 0; i < centroids.length; i++) {
        let dist = Math.sqrt(Math.pow(x - centroids[i].x, 2) + Math.pow(y - centroids[i].y, 2));
        if (dist <= minDist) {
            index = i;
            isCentroid = true;
            minDist = dist;
        }
    }

    return {
        index,
        isCentroid
    };
}

/**
 * Adds single data on click
 * @param {TouchEvent} e 
 */
const addData = (e) => {
    const data = store.getState().canvas.Data;
    const { x, y } = getClickCoodinates(e);

    const dataPoint = new Point(x, y, white);
    drawData(dataPoint);

    const newData = [...data, dataPoint];
    store.dispatch(Action_Update_Data(newData));
    store.dispatch(Action_Update_Data_Count(newData.length));
}

/**
 * Adds single centroid on click
 * @param {TouchEvent} e 
 */
const addCentroid = (e) => {
    const centroids = store.getState().canvas.Centroids;
    const { x, y } = getClickCoodinates(e);

    const centroidPoint = new Point(x, y, generateColor(), true);
    drawCentroid(centroidPoint);

    const newCentroids = [...centroids, centroidPoint];
    store.dispatch(Action_Update_Centroids(newCentroids));
    store.dispatch(Action_Update_Centroid_Count(newCentroids.length));
}

/**
 * Removes the clicked data or centroid
 * @param {TouchEvent} e
 */
const removePoint = (e) => {
    const data = store.getState().canvas.Data;
    const centroids = store.getState().canvas.Centroids;
    const { x, y } = getClickCoodinates(e);

    const { index, isCentroid } = getPointToRemove(x, y, data, centroids);

    if(index === -1) {
        return;
    }
    
    let newData = data;
    let newCentroids = centroids;

    if(isCentroid) {
        newCentroids.splice(index, 1);
    }else newData.splice(index, 1);

    clearBoard();
    for(let i = 0 ; i < newData.length ; i++) {
        drawData(newData[i]);
    }

    for(let j = 0 ; j < newCentroids.length ; j++) {
        drawCentroid(newCentroids[j]);
    }

    store.dispatch(Action_Update_Centroid_Count(newCentroids.length));
    store.dispatch(Action_Update_Centroids(newCentroids));
    store.dispatch(Action_Update_Data_Count(newData.length));
    store.dispatch(Action_Update_Data(newData));
}

const removeCanvasClickEvents = () => {
    canvas.removeEventListener("click", addData, false);
    canvas.removeEventListener("click", addCentroid, false);
    canvas.removeEventListener("click", removePoint, false);
    store.dispatch(Action_Update_Secondary_Ctrl(""));
}

/**
 * @param {string} ctrlId Secondary Control Id
 */
export const changeCanvasClickEvent = (ctrlId) => {
    const canvas = document.getElementById("canvas");

    removeCanvasClickEvents();
    store.dispatch(Action_Update_Secondary_Ctrl(ctrlId));

    switch (ctrlId) {
        case "add-data-btn":
            canvas.addEventListener("click", addData, false);
            break;
    
        case "add-centroid-btn":
            canvas.addEventListener("click", addCentroid, false);
            break;
        
        case "remove-point-btn":
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

    document.getElementById("rocket").style.fill = "grey";
    document.getElementById("clear").style.fill = "grey";
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

    document.getElementById("rocket").style.fill = "green";
    document.getElementById("clear").style.fill = "red";
}