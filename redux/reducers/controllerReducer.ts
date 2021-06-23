import { SecondaryControlButtons } from "../../lib/enums";
import { ActionTypes } from "../states-and-actions/action-types";
import { AController } from "../states-and-actions/actions";
import { SController } from "../states-and-actions/states";

const initialState: SController = {
    DataCount: 0,
    CentersCount: 0,
    SecondaryControl: SecondaryControlButtons.None,
    Epsilon: 30,
    MinPoints: 3
};

export const controllerReducer = (state: SController = initialState, action: AController): SController => {
    switch (action.type) {
        case ActionTypes.DataCountUpdate:
            return {
                ...state,
                DataCount: action.payload
            };

        case ActionTypes.CentersCountUpdate:
            return {
                ...state,
                CentersCount: action.payload
            };

        case ActionTypes.SecondaryControlUpdate:
            return {
                ...state,
                SecondaryControl: action.payload
            };

        case ActionTypes.EpsilonUpdate:
            return {
                ...state,
                Epsilon: action.payload
            };
        
        case ActionTypes.MinimumPointsUpdate:
            return {
                ...state,
                MinPoints: action.payload
            };
            
        default:
            return { ...state };
    }
}