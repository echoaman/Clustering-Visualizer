import { Update_Selected_Algorithm } from "../types";

const initialState = {
    Selected_Algorithm : "kmeans"
}

export const algorithmsReducer = (state = initialState, action) => {
    switch (action.type) {
        case Update_Selected_Algorithm:
            return {
                ...state,
                Selected_Algorithm : action.payload
            };
    
        default:
            return { ...state };
    }
}