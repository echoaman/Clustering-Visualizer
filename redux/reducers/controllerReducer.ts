import { Update_Centroid_Count, Update_Data_Count, Update_Secondary_Ctrl } from "../types";

const initialState = {
    Data_Count : 0,
    Centroid_Count : 0,
    Secondary_Ctrl : ""
};

export const controllerReducer = (state = initialState, action) => {
    switch (action.type) {
        case Update_Data_Count:
            return {
                ...state,
                Data_Count: action.payload
            };
    
        case Update_Centroid_Count:
            return {
                ...state,
                Centroid_Count: action.payload
            }
        
        case Update_Secondary_Ctrl:
            return {
                ...state,
                Secondary_Ctrl: action.payload
            }
        default:
            return { ...state };
    }
}