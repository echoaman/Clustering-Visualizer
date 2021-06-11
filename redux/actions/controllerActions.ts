import { Update_Centroid_Count, Update_Data_Count, Update_Secondary_Ctrl } from "../types";

/**
 * @param {number} count 
 */
export const Action_Update_Data_Count = (count) => {
    return {
        type: Update_Data_Count,
        payload : count
    };
}

/**
 * @param {number} count 
 */
export const Action_Update_Centroid_Count = (count) => {
    return {
        type: Update_Centroid_Count,
        payload : count
    };
}

/**
 * @param {string} id 
 */
export const Action_Update_Secondary_Ctrl = (id) => {
    return {
        type: Update_Secondary_Ctrl,
        payload : id
    };
}

