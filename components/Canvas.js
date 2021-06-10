import canvasStyles from "../styles/Canvas.module.css";
import { useEffect } from "react";

const Canvas = () => {

    // componentDidMount
    // set the width and height of canvas
    useEffect(() => {
        let canvas = document.getElementById("canvas");
        let boardBoundingClientRect = canvas.getBoundingClientRect();
        canvas.height = boardBoundingClientRect.height;
        canvas.width = boardBoundingClientRect.width;
    }, []);

    return (
        <section className={canvasStyles.canvas_container} id="canvas-container">
            <canvas id="canvas" className={canvasStyles.canvas}></canvas>
        </section>
    );
}

export default Canvas;