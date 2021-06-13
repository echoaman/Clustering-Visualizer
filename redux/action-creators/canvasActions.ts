import { Point } from "../../lib/Point";
import { ActionTypes } from "../states-and-actions/action-types";
import { ACanvas } from "../states-and-actions/actions";

export const updateDataListAction = (data: Point[]): ACanvas => {
    return {
        type: ActionTypes.DataListUpdate,
        payload: data
    };
}

export const updateCentersListAction = (centers: Point[]): ACanvas => {
    return {
        type: ActionTypes.CentersListUpdate,
        payload: centers
    };
}