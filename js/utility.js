import { Action_Update_Centroids, Action_Update_Data } from "../redux/actions/canvasActions";
import { Action_Update_Centroid_Count, Action_Update_Data_Count } from "../redux/actions/controllerActions";
import { store } from "../redux/store";
import { Point } from "./Point";

const radius = 5;
const white = "#fff";
const black = "#000";

export const clearBoard = () => {
    const board = document.getElementById("canvas");
    const context = board.getContext("2d");
    context.clearRect(0, 0, board.width, board.height);
}

export const drawCentroid = (centroid) => {
    const board = document.getElementById("canvas");
    const context = board.getContext("2d");

    let rot = Math.PI / 2 * 3;
    let x = centroid.x;
    let y = centroid.y;
    let step = Math.PI / 5;

    context.beginPath();
    context.moveTo(centroid.x, centroid.y - radius)
    for (let i = 0; i < 5; i++) {
        x = centroid.x + Math.cos(rot) * radius;
        y = centroid.y + Math.sin(rot) * radius;
        context.lineTo(x, y)
        rot += step

        x = centroid.x + Math.cos(rot) * 2;
        y = centroid.y + Math.sin(rot) * 2;
        context.lineTo(x, y)
        rot += step
    }
    context.lineTo(centroid.x, centroid.y - radius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = black;
    context.stroke();
    context.fillStyle = centroid.color;
    context.fill();
}

export const drawData = (data) => {
    const board = document.getElementById("canvas");
    const context = board.getContext("2d");

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
    const board = document.getElementById("canvas");
    let newData = [];

    clearBoard();

    for(let i = 0 ; i < count ; i++) {
        let data = new Point(Math.random() * (board.width - radius * 2) + radius, Math.random() * (board.height - radius * 2) + radius, white);

        newData.push(data);
        drawData(data);
    }

    const centroids = store.getState().canvas.Centroids;
    for(let j = 0 ; j < centroids.length ; j++) {
        drawCentroid(centroids[j]);
    }

    store.dispatch(Action_Update_Data(newData));
}

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
    const board = document.getElementById("canvas");
    let newCentroids = [];

    clearBoard();
    
    const data = store.getState().canvas.Data;
    for(let j = 0 ; j < data.length ; j++) {
        drawData(data[j]);
    }

    for(let i = 0 ; i < count ; i++) {
        let centroid = new Point(Math.random() * (board.width - radius * 2) + radius, Math.random() * (board.height - radius * 2) + radius, generateColor(), true);
        
        newCentroids.push(centroid);
        drawCentroid(centroid);
    }

    store.dispatch(Action_Update_Centroids(newCentroids));
}