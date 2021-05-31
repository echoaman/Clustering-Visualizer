import canvasStyles from "../styles/Canvas.module.css";

const Canvas = () => {
    return (
        <section className={canvasStyles.canvas_container}>
            <canvas width="1200" height="400" style={{background : "black"}}></canvas>
        </section>
    );
}

export default Canvas;