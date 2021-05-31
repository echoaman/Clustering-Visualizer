import Head from "next/head";
import Canvas from "../components/Canvas";
import Footer from "../components/Footer";
import Algorithms from "../components/Algorithms";
import Controller from "../components/Controller";
import styles from "../styles/Home.module.css"

const Home = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Clustering Visualizer</title>
                <meta name="description" content="Clustering Visualizer" />
                <meta name="keywords" content="Clustering Visualizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Canvas />
            <Algorithms />
            <Controller />
            <Footer />
        </div>
    );
}

export default Home;