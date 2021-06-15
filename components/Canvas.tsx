import canvasStyles from "../styles/Canvas.module.css";

export default function Canvas() {

    return (
        <section className={canvasStyles.canvas_container} id="canvas-container">
            <canvas id="canvas" className={canvasStyles.canvas}></canvas>
        </section>
    );
}