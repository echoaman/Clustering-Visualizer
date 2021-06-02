import controllerStyles from "../styles/Controller.module.css";
import { useState } from 'react';

const Controller = () => {

    const [dataCount, setDataCount] = useState(10);
    const [centroidCount, setCentroidCount] = useState(0);
    const [secCtrl, setSecCtrl] = useState("add-data-btn");

    return (
        <section className={controllerStyles.controller}>
            <div className={controllerStyles.main_ctrl} >
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Data count</span>
                    <input type="range" min="0" max="500" value={dataCount} step="1" onChange={e => setDataCount(e.target.value)} style={{width : "250px"}} />
                    <span className={controllerStyles.main_ctrl_item_count}>{dataCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="data-random">Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Centroid count</span>
                    <input type="range" min="0" max="10" value={centroidCount} step="1" onChange={e => setCentroidCount(e.target.value)} style={{width : "250px"}} />
                    <span className={controllerStyles.main_ctrl_item_count}>{centroidCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="centroid-random">Randomize</button>
                </div>
            </div>
            <div className={controllerStyles.sec_ctrl}>
                <button id="add-data-btn" style={{ color: secCtrl === "add-data-btn" ? "white" : "grey" }} onClick={() => setSecCtrl("add-data-btn")} >Add data</button>
                <button id="add-centroid-btn" style={{ color: secCtrl === "add-centroid-btn" ? "white" : "grey" }} onClick={() => setSecCtrl("add-centroid-btn")} >Add centroid</button>
                <button id="remove-data-btn" style={{ color: secCtrl === "remove-data-btn" ? "white" : "grey" }} onClick={() => setSecCtrl("remove-data-btn")} >Remove data/centroid</button>
            </div>
        </section>
    );
}

export default Controller;