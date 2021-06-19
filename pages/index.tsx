import Head from "next/head";
import Canvas from "../components/Canvas";
import Footer from "../components/Footer";
import Algorithms from "../components/Algorithms";
import Controller from "../components/Controller";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {

    const setCanvasDimensions = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const canvasBoundingClientRect = canvas.getBoundingClientRect();
        canvas.height = canvasBoundingClientRect.height;
        canvas.width = canvasBoundingClientRect.width;
    };

    const updateCoordinates = (e: MouseEvent) => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const spanX = document.getElementById("coorX") as HTMLSpanElement;
        const spanY = document.getElementById("coorY") as HTMLSpanElement;
        const { x, y, height } = canvas.getBoundingClientRect();
        const coorX: number = e.x - x;
        const coorY: number = height - (e.y - y);

        spanX.innerHTML = `X &#8776; ${Math.floor(coorX)}`;
        spanY.innerHTML = `Y &#8776; ${Math.floor(coorY)}`;
    };

    const resetCoordinates = () => {
        const spanX = document.getElementById("coorX") as HTMLSpanElement;
        const spanY = document.getElementById("coorY") as HTMLSpanElement;
        spanX.innerHTML = `X &#8776; 0`;
        spanY.innerHTML = `Y &#8776; 0`;
    };

    // componentDidMount
    useEffect(() => {
        setCanvasDimensions();
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.addEventListener("mousemove", updateCoordinates, false);
        canvas.addEventListener("mouseleave", resetCoordinates, false);
        canvas.addEventListener("touchend", resetCoordinates, false);
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Clustering Visualizer</title>
                <meta name="description" content="Clustering Visualizer" />
                <meta name="keywords" content="Clustering Visualizer" />
            </Head>
            <Canvas />
            <Algorithms />
            <Controller />
            <Footer />
        </div>
    );
}