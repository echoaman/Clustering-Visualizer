import controllerStyles from "../styles/Controller.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducers/rootReducer";
import { AController } from "../redux/states-and-actions/actions";
import { updateCentersCountAction, updateDataCountAction } from "../redux/action-creators/controllerActions";
import { SecondaryControlButtons } from "../lib/enums";
import { changeCanvasClickEvent, generateRandomCenters, generateRandomData } from "../lib/utility";

export default function Controller() {

    const dispatch = useDispatch();
    const DataCount = useSelector((state: AppState) => state.controller.DataCount);
    const CentersCount = useSelector((state: AppState) => state.controller.CentersCount);
    const SecondaryControl = useSelector((state: AppState) => state.controller.SecondaryControl);

    const dataCountChange = (count: number) => {
        dispatch<AController>(updateDataCountAction(count));
        generateRandomData();
    }

    const centerCountChange = (count: number) => {
        dispatch<AController>(updateCentersCountAction(count));
        generateRandomCenters();
    }

    const secondaryControlChange = (ctrlId: SecondaryControlButtons) => {
        if(ctrlId === SecondaryControl) {
            ctrlId = SecondaryControlButtons.None;
        }
        
        changeCanvasClickEvent(ctrlId);
    }

    return (
        <section className={controllerStyles.controller}>
            <div className={controllerStyles.main_ctrl} >
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Data count</span>
                    <input className={controllerStyles.range} type="range" min="0" max="500" value={DataCount} step="1" onChange={e => dataCountChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count}>{DataCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="data-random" onClick={() => generateRandomData()}>Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Centroid count</span>
                    <input className={controllerStyles.range} type="range" min="0" max="10" value={CentersCount} step="1" onChange={e => centerCountChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count}>{CentersCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} id="centroid-random" onClick={() => generateRandomCenters()}>Randomize</button>
                </div>
            </div>
            <div className={controllerStyles.sec_ctrl}>
                <button id={SecondaryControlButtons.AddData} className={SecondaryControl === SecondaryControlButtons.AddData ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.AddData)} >Add data</button>
                <button id={SecondaryControlButtons.AddCenter} className={SecondaryControl === SecondaryControlButtons.AddCenter ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.AddCenter)} >Add centroid</button>
                <button id={SecondaryControlButtons.RemovePoint} className={SecondaryControl === SecondaryControlButtons.RemovePoint ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.RemovePoint)} >Remove data/centroid</button>
            </div>
        </section>
    );
}