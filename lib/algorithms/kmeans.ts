import { updateCentersListAction } from "../../redux/action-creators/canvasActions";
import { updateCentersCountAction } from "../../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../../redux/states-and-actions/actions";
import { store } from "../../redux/store"
import { Point } from "../Point";
import { clearBoard, drawCenter, drawData, generateColor, getClickCoordinates, radius } from "../utility";

export const generateRandomCentroids = () => {
    const count = store.getState().controller.CentersCount;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const data = store.getState().canvas.Data;
    clearBoard();

    let centroids = <Point[]>[];

    data.forEach((point) => {
        drawData(point);
    });

    for(let i = 0 ; i < count ; i++) {
        let centroid = new Point(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, generateColor(), true);
        drawCenter(centroid);
        centroids.push(centroid);
    }

    store.dispatch<ACanvas>(updateCentersListAction(centroids));
}

export const addCentroid = (e: MouseEvent) => {
        const centers = store.getState().canvas.Centers;
        const { x, y } = getClickCoordinates(e);

        const centroid = new Point(x, y, generateColor(), true);
        drawCenter(centroid);

        const newCenters = [...centers, centroid];
        store.dispatch<ACanvas>(updateCentersListAction(newCenters));
        store.dispatch<AController>(updateCentersCountAction(newCenters.length));
}