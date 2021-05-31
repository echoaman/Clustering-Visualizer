import algoStyles from "../styles/Algorithms.module.css";

const Algorithms = () => {
    return (
        <section className={algoStyles.algo_container}>
            <div className={algoStyles.wrapper} style={{width : "80%"}}>
                <button className={algoStyles.algo_btn} id="k_means_btn">K Means</button>
            </div>
            <div className={algoStyles.wrapper} style={{width : "20%"}}>
                <button id={algoStyles.run_btn}>Run !</button>
            </div>
        </section>
    );
}

export default Algorithms;