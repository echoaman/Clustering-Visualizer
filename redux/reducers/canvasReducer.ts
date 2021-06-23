import { ActionTypes } from "../states-and-actions/action-types";
import { ACanvas } from "../states-and-actions/actions";
import { SCanvas } from "../states-and-actions/states";

const initialState: SCanvas = {
    Data: [],
    Centroids: [],
};

export const canvasReducer = (state: SCanvas = initialState, action: ACanvas): SCanvas => {
    switch (action.type) {
        case ActionTypes.DataListUpdate:
            return {
                ...state,
                Data: action.payload
            };

        case ActionTypes.CentersListUpdate:
            return {
                ...state,
                Centroids: action.payload
            };

        default:
            return { ...state };
    };
}