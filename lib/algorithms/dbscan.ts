import { updateDataListAction } from "../../redux/action-creators/canvasActions";
import { updateDataCountAction } from "../../redux/action-creators/controllerActions";
import { ACanvas, AController } from "../../redux/states-and-actions/actions";
import { store } from "../../redux/store"
import { Settings } from "../enums";
import { Point } from "../Point";
import { Utility } from "../utility";

export namespace Dbscan
{
    let data: Point[] = [];
    let clusters: number[][] = [];
    let currCluster: number[] = [];
    let clusterIdx: number = 0;
    let coreIdx: number = 0;
    let currColor: string = "";
    let epsilon: number = 0;
    let minPoints: number = 0;

    export const generateRandomData = () => {
        const count: number = store.getState().controller.DataCount;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let newData: Point[] = [];

        Utility.clearBoard();

        for(let i = 0 ; i< count; i++) {
            let datum: Point = new Point(Math.random() * (canvas.width - Settings.Radius * 2) + Settings.Radius, Math.random() * (canvas.height - Settings.Radius * 2) + Settings.Radius, Settings.White);

            newData.push(datum);
            Utility.drawData(datum.x, datum.y, datum.color);
        }

        store.dispatch<ACanvas>(updateDataListAction(newData));
    }

    export const removePoint = (e: MouseEvent) => {
        let currData: Point[] = store.getState().canvas.Data;
        const { x, y } =  Utility.getClickCoordinates(e);
        const { index, isCenter } = Utility.getClickedPoint(x, y, currData);

        if (index === -1) {
            return;
        }

        currData.splice(index, 1);

        Utility.clearBoard();
        currData.forEach((datum) => {
            Utility.drawData(datum.x, datum.y, datum.color);
        });

        store.dispatch<ACanvas>(updateDataListAction(currData));
        store.dispatch<AController>(updateDataCountAction(currData.length));
    }

    const resetBoard = () => {
        Utility.clearBoard();

        const currData: Point[] = store.getState().canvas.Data;

        currData.forEach((datum) => {
            datum.color = Settings.White;
            datum.isCenter = false;
            Utility.drawData(datum.x, datum.y, datum.color);
        });

        epsilon = store.getState().controller.Neighbourhood;
        minPoints = store.getState().controller.MinPoints;
        data = currData;
        clusters = [];
        currCluster = [];
        coreIdx = 0;
        clusterIdx = 0;
        currColor = "";
    }

    const findNeighbours = (idx: number): number[] => {
        const neighbours = [];
        for (let i = 0 ; i < data.length ; i++) {
            if(i !== idx) {
                let dist = Utility.euclideanDistance(data[i], data[idx]);
                if (dist <= epsilon) {
                    neighbours.push(i);
                }
            }
        }

        return neighbours;
    }

    const createCluster = (idx: number, possibleCores: number[]) => {
        let cluster: number[] = [idx];
        let i = 0;

        while(i < possibleCores.length) {
            if(!data[possibleCores[i]].isCenter) {
                const neighbours: number[] = findNeighbours(possibleCores[i]);
                if(neighbours.length + 1 >= minPoints) {
                    data[possibleCores[i]].isCenter = true;

                    neighbours.forEach((neighbour) => {
                        if(cluster.indexOf(neighbour) < 0) {
                            possibleCores.push(neighbour);
                        }
                    });
                    cluster.push(possibleCores[i]);
                }
            }
            i++;
        }

        clusters.push(cluster);
    }

    const animateClusterCreation = () => {
        if (coreIdx < currCluster.length) {
            data[currCluster[coreIdx]].color = currColor;
            const { x, y, color } = data[currCluster[coreIdx]];
            Utility.drawCircle(x ,y ,color);

            coreIdx++;
            requestAnimationFrame(animateClusterCreation);
        } else {
            coreIdx = 0;
            clusterIdx++;
            animate();
        }
    }

    const animate = () => {
        if(clusterIdx < clusters.length) {
            currColor = Utility.getHexColor();
            currCluster = clusters[clusterIdx];
            animateClusterCreation();
        } else {
            alert("DBSCAN completed!");

            Utility.clearBoard();
            data.forEach((datum) => {
                const { x, y, color, isCenter } = datum;
                if(!isCenter) {
                    Utility.drawData(x, y, color);
                }
            });

            data.forEach((datum) => {
                const { x, y, color, isCenter } = datum;
                if(isCenter) {
                    Utility.drawCircle(x, y, color);
                }
            });

            data.forEach((datum) => {
                const { x, y, color, isCenter } = datum;
                if(isCenter) {
                    Utility.drawCenter(x, y, color);
                }
            });

            store.dispatch<ACanvas>(updateDataListAction(data));
            Utility.enableButtons();
        }
    }

    export const init = () => {
        const count: number = store.getState().controller.DataCount;
        if(count === 0) {
            alert("Please add data!");
            return;
        }

        resetBoard();

        Utility.disableButtons();

        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].isCenter) {
                continue;
            }

            const neighbours: number[] = findNeighbours(i);
            if(neighbours.length + 1 >= minPoints) {
                data[i].isCenter = true;
                createCluster(i, neighbours);
            }
        }

        // console.log(clusters);
        // clusters.forEach((c) => {
        //     let co = Utility.getHexColor();
        //     c.forEach(core => {
        //         Utility.drawCenter(data[core].x, data[core].y, co);
        //         Utility.drawCircle(data[core].x, data[core].y, co);
        //     });
        // });
        animate();
    }
}