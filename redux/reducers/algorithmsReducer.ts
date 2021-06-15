import { Algos } from "../../lib/enums";
import { ActionTypes } from "../states-and-actions/action-types";
import { AAlgorithms } from "../states-and-actions/actions";
import { SAlgorithms } from "../states-and-actions/states";

const initialState: SAlgorithms = {
    SelectedAlgorithm: Algos.Kmeans,
    IsAppRunning: false
};

export const algorithmsReducer = (state: SAlgorithms = initialState, action: AAlgorithms): SAlgorithms => {
    switch (action.type) {
        case ActionTypes.AlgorithmUpdate:
            return {
                ...state,
                SelectedAlgorithm: action.payload
            };

        case ActionTypes.AppRunningToggle:
            return{
                ...state,
                IsAppRunning: !state.IsAppRunning
            }
        default:
            return { ...state };
    };
}