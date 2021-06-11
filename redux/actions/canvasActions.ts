import { Update_Centroids, Update_Data } from "../types";
import { Point } from "../../js/Point";

/**
 * @param {Point[]} data 
 */
export const Action_Update_Data = (data) => {
    return {
        type : Update_Data,
        payload : data
    };
}

/**
 * @param {Point[]} centroids  
 */
export const Action_Update_Centroids = (centroids) => {
    return {
        type : Update_Centroids,
        payload : centroids
    };
}