import controllerStyles from "../styles/Controller.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Action_Update_Centroid_Count, Action_Update_Data_Count, Action_Update_Secondary_Ctrl } from "../redux/actions/controllerActions";
import { changeCanvasClickEvent, generateRandomCentroids, generateRandomData } from "../js/utility";

const Controller = () => {

    const dispatch = useDispatch();
    const dataCount = useSelector(state => state.controller.Data_Count);
    const centroidCount = useSelector(state => state.controller.Centroid_Count);
    const secCtrl = useSelector(state => state.controller.Secondary_Ctrl);

    const dataCountChange = (count) => {
        dispatch(Action_Update_Data_Count(count));
        generateRandomData(count);
    }

    const centroidCountChange = (count) => {
        dispatch(Action_Update_Centroid_Count(count));
        generateRandomCentroids(count);
    }

    const secondaryControlChange = (ctrlId) => {
        if(ctrlId === secCtrl) {
            ctrlId = "";
        }
        
        changeCanvasClickEvent(ctrlId);
    }

    return (
        <section className={controllerStyles.controller}>
            <div className={controllerStyles.main_ctrl} >
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Data count</span>
                    <input className={controllerStyles.range} type="range" min="0" max="500" value={dataCount} step="1" onChange={e => dataCountChange(e.target.value)} />
                    <span className={controllerStyles.main_ctrl_item_count}>{dataCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="data-random" onClick={() => generateRandomData()}>Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Centroid count</span>
                    <input className={controllerStyles.range} type="range" min="0" max="10" value={centroidCount} step="1" onChange={e => centroidCountChange(e.target.value)} />
                    <span className={controllerStyles.main_ctrl_item_count}>{centroidCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="centroid-random" onClick={() => generateRandomCentroids()}>Randomize</button>
                </div>
            </div>
            <div className={controllerStyles.sec_ctrl}>
                <button id="add-data-btn" className={secCtrl === "add-data-btn" ? "" : "inactive-btn"} onClick={() => secondaryControlChange("add-data-btn")} >Add data</button>
                <button id="add-centroid-btn" className={secCtrl === "add-centroid-btn" ? "" : "inactive-btn"} onClick={() => secondaryControlChange("add-centroid-btn")} >Add centroid</button>
                <button id="remove-point-btn" className={secCtrl === "remove-point-btn" ? "" : "inactive-btn"} onClick={() => secondaryControlChange("remove-point-btn")} >Remove data/centroid</button>
            </div>
        </section>
    );
}

export default Controller;