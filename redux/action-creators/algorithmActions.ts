import { Algos } from "../../lib/enums";
import { ActionTypes } from "../states-and-actions/action-types";
import { AAlgorithms } from "../states-and-actions/actions";

export const updateSelectedAlgorithm = (algoId: Algos): AAlgorithms => {
    return {
        type: ActionTypes.AlgorithmUpdate,
        payload: algoId
    };
}

export const appRunningToggle = ():AAlgorithms => {
    return {
        type: ActionTypes.AppRunningToggle
    };
}