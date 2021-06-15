import algoStyles from "../styles/Algorithms.module.css";
import { clearBoard, startAlgo } from "../lib/utility";
import { useDispatch, useSelector } from "react-redux";
import { Algos } from "../lib/enums";
import { updateCentersListAction, updateDataListAction } from "../redux/action-creators/canvasActions";
import { updateCentersCountAction, updateDataCountAction } from "../redux/action-creators/controllerActions";
import { AAlgorithms, ACanvas, AController } from "../redux/states-and-actions/actions";
import { AppState } from "../redux/reducers/rootReducer";
import { updateSelectedAlgorithm } from "../redux/action-creators/algorithmActions";

export default function Algorithms() {

    const dispatch = useDispatch();
    const IsAppRunning: boolean = useSelector((state: AppState) => state.algorithms.IsAppRunning);
    const selectedAlgo: Algos = useSelector((state: AppState) => state.algorithms.SelectedAlgorithm);

    const handleClearBoard = () => {
        dispatch<ACanvas>(updateDataListAction([]));
        dispatch<ACanvas>(updateCentersListAction([]));
        dispatch<AController>(updateDataCountAction());
        dispatch<AController>(updateCentersCountAction());
        
        clearBoard();
    };

    return (
        <section className={algoStyles.algo_container}>
            <div className={algoStyles.wrapper} style={{ width : "80%" }}>
                <button className={selectedAlgo === Algos.Kmeans ? "" : "inactive-btn"} onClick={() => dispatch<AAlgorithms>(updateSelectedAlgorithm(Algos.Kmeans))} disabled={IsAppRunning} id={Algos.Kmeans}>K Means</button>
            </div>
            <div className={algoStyles.wrapper} style={{ width : "20%" }}>
                <button id="start-btn" className={algoStyles.ctrl} disabled={IsAppRunning} style={{ background: IsAppRunning ? "transparent" : "green", color: IsAppRunning ? "grey" : "black" }} onClick={() => startAlgo()} >Visualize <svg style={{ marginLeft : "5px" }} xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="24" height="24" preserveAspectRatio="xMinYMin"><path id="rocket" fill={IsAppRunning ? "grey" : "black"} d="M7.21 16.067a6.687 6.687 0 0 1-.664.772c-1.172 1.171-2.94 1.525-5.303 1.06-.465-2.363-.111-4.131 1.06-5.303.247-.247.506-.468.772-.663a8.975 8.975 0 0 0-2.599-.81A5.974 5.974 0 0 1 1.95 8.707a5.977 5.977 0 0 1 3.81-1.742 13.637 13.637 0 0 1 2.2-2.854c3.32-3.32 7.593-4.428 9.546-2.475 1.953 1.953.845 6.227-2.475 9.546a13.637 13.637 0 0 1-2.854 2.2 5.977 5.977 0 0 1-1.742 3.81c-.7.701-1.532 1.193-2.416 1.474a8.975 8.975 0 0 0-.81-2.599zM13.262 5.88a1 1 0 1 0 1.415-1.415 1 1 0 0 0-1.415 1.415zm-7.778 7.778c-.109-.11-.286-.277-.53-.503-.432.15-.944.574-1.414 1.033-.371.363-.497.973-.5 1.92.946-.004 1.62-.22 1.914-.506.471-.459.89-.917 1.04-1.35-.112-.194-.346-.43-.51-.594z"></path></svg></button>
                <button id="clear-btn" className={algoStyles.ctrl} disabled={IsAppRunning} style={{ background: IsAppRunning ? "transparent" : "red", color: IsAppRunning ? "grey" : "black" }} onClick={() => handleClearBoard()} >Clear board <svg style={{ marginLeft : "5px" }} xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -2.5 24 24" width="24" height="24" preserveAspectRatio="xMinYMin"><path id="clear" fill={IsAppRunning ? "grey" : "black"} d="M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z"></path></svg></button>
            </div>
        </section>
    );
}