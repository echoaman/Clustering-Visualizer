import { Point } from "../../js/Point";
import { Update_Centroids, Update_Data } from "../types";


/**
 * @type {Object}
 * @property {Point[]} Data
 * @property {Point[]} Data
 */
const initialState = {
    Data : [],
    Centroids : [],
};

export const canvasReducer = (state = initialState, action) => {
    switch (action.type) {
        case Update_Data:
            return {
                ...state,
                Data : action.payload
            };

        case Update_Centroids:
            return {
                ...state,
                Centroids : action.payload
            };

        default:
            return { ...state };
    }
}