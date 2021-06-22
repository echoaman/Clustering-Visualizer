import controllerStyles from "../styles/Controller.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducers/rootReducer";
import { AController } from "../redux/states-and-actions/actions";
import { updateCentersCountAction, updateDataCountAction, updateMinPointsAction, updateNeighbourhoodAction } from "../redux/action-creators/controllerActions";
import { Algos, SecondaryControlButtons, Settings } from "../lib/enums";
import { Utility } from "../lib/utility";

export default function Controller() {

    const dispatch = useDispatch();
    const DataCount: number = useSelector((state: AppState) => state.controller.DataCount);
    const CentersCount: number = useSelector((state: AppState) => state.controller.CentersCount);
    const SecondaryControl: SecondaryControlButtons = useSelector((state: AppState) => state.controller.SecondaryControl);
    const IsAppRunning: boolean = useSelector((state: AppState) => state.algorithms.IsAppRunning);
    const SelectedAlgo: Algos = useSelector((state: AppState) => state.algorithms.SelectedAlgorithm);
    const Epsilon: number = useSelector((state: AppState) => state.controller.Neighbourhood);
    const MinPoints: number = useSelector((state: AppState) => state.controller.MinPoints);

    const dataCountChange = (count: number) => {
        dispatch<AController>(updateDataCountAction(count));
        Utility.generateRandomData();
    };

    const centerCountChange = (count: number) => {
        dispatch<AController>(updateCentersCountAction(count));
        Utility.generateRandomCenters();
    }

    const secondaryControlChange = (ctrlId: SecondaryControlButtons) => {
        if(ctrlId === SecondaryControl) {
            ctrlId = SecondaryControlButtons.None;
        }
        
        Utility.changeCanvasClickEvent(ctrlId);
    }

    const neighbourHoodChange = (epsilon: number) => {
        dispatch<AController>(updateNeighbourhoodAction(epsilon));
    }

    const minPointsChange = (count: number) => {
        dispatch<AController>(updateMinPointsAction(count));
    }

    return (
        <section className={controllerStyles.controller}>
            <div className={controllerStyles.coordinates}>
                <span className={controllerStyles.coordinates_label}>Coordinates</span>
                <span id="coorX" className={controllerStyles.coordinates_x} >X &#8776; 0</span>
                <span id="coorY" className={controllerStyles.coordinates_y} >Y &#8776; 0</span>
            </div>
            <div className={controllerStyles.main_ctrl} >
                <div className={controllerStyles.main_ctrl_item}>
                    <span className={controllerStyles.main_ctrl_item_label}>Data</span>
                    <input className={controllerStyles.range} disabled={IsAppRunning} type="range" min="0" max={Settings.MaxDataLimit} value={DataCount} step="1" onChange={(e) => dataCountChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count}>{DataCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} disabled={IsAppRunning} onClick={() => Utility.generateRandomData()}>Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item} style={{ display: SelectedAlgo === Algos.Kmeans ? "block" : "none" }} >
                    <span className={controllerStyles.main_ctrl_item_label}>Centroids</span>
                    <input className={controllerStyles.range} disabled={IsAppRunning} type="range" min="0" max={Settings.MaxCenterLimit} value={CentersCount} step="1" onChange={(e) => centerCountChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count}>{CentersCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} disabled={IsAppRunning} onClick={() => Utility.generateRandomCenters()}>Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item} style={{ display: SelectedAlgo === Algos.Kmedoids ? "block" : "none" }} >
                    <span className={controllerStyles.main_ctrl_item_label}>Medoids</span>
                    <input className={controllerStyles.range} disabled={IsAppRunning} type="range" min="0" max={Math.min(DataCount, Settings.MaxCenterLimit)} value={CentersCount} step="1" onChange={(e) => centerCountChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count}>{CentersCount}</span>
                    <button className={controllerStyles.main_ctrl_item_random} disabled={IsAppRunning} onClick={() => Utility.generateRandomCenters()}>Randomize</button>
                </div>
                <div className={controllerStyles.main_ctrl_item} style={{ display: SelectedAlgo === Algos.Dbsacn ? "block" : "none" }} >
                    <span className={controllerStyles.main_ctrl_item_label} title="Neighbourhood radius" >Neigbourhood Radius (&epsilon;)</span>
                    <input className={controllerStyles.range} disabled={IsAppRunning} type="range" min="20" max="40" value={Epsilon} step="1" onChange={(e) => neighbourHoodChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count} style={{ left: "50%", transform: "translateX(-50%)" }} >{Epsilon}</span>
                </div>
                <div className={controllerStyles.main_ctrl_item} style={{ display: SelectedAlgo === Algos.Dbsacn ? "block" : "none" }} >
                    <span className={controllerStyles.main_ctrl_item_label} >Minimum points</span>
                    <input className={controllerStyles.range} disabled={IsAppRunning} type="range" min="3" max="10" value={MinPoints} step="1" onChange={(e) => minPointsChange(parseInt(e.target.value))} />
                    <span className={controllerStyles.main_ctrl_item_count} style={{ left: "50%", transform: "translateX(-50%)" }} >{MinPoints}</span>
                </div>
            </div>
            <div className={controllerStyles.sec_ctrl}>
                <button disabled={IsAppRunning} className={SecondaryControl === SecondaryControlButtons.AddData ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.AddData)} >Add data</button>
                <button disabled={IsAppRunning} style={{ display: SelectedAlgo === Algos.Kmeans ? "block" : "none" }} className={SecondaryControl === SecondaryControlButtons.AddCenter ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.AddCenter)} >Add centroid</button>
                <button disabled={IsAppRunning} style={{ display: SelectedAlgo === Algos.Kmedoids ? "block" : "none" }} className={SecondaryControl === SecondaryControlButtons.AddCenter ? "" : "inactive-btn"} onClick={() => secondaryControlChange(SecondaryControlButtons.AddCenter)} >Add medoid</button>
                <button disabled={IsAppRunning} className={SecondaryControl === SecondaryControlButtons.RemovePoint ? "" : "inactive-btn"}  onClick={() => secondaryControlChange(SecondaryControlButtons.RemovePoint)} >Remove point</button>
            </div>
        </section>
    );
}