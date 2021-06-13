import { useEffect } from "react";
import canvasStyles from "../styles/Canvas.module.css";

export default function Canvas() {

    // componentDidMount
    // set the width and height of canvas
    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const canvasBoundingClientRect = canvas.getBoundingClientRect();
        canvas.height = canvasBoundingClientRect.height;
        canvas.width = canvasBoundingClientRect.width;
    }, []);

    return (
        <section className={canvasStyles.canvas_container} id="canvas-container">
            <canvas id="canvas" className={canvasStyles.canvas}></canvas>
        </section>
    );
}