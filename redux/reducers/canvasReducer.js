import { Update_Centroids, Update_Data } from "../types";

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