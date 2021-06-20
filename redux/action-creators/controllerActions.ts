import { SecondaryControlButtons } from "../../lib/enums";
import { ActionTypes } from "../states-and-actions/action-types";
import { AController } from "../states-and-actions/actions";

export const updateDataCountAction = (count: number = 0): AController => {
    return {
        type: ActionTypes.DataCountUpdate,
        payload: count
    };
}

export const updateCentersCountAction = (count: number = 0): AController => {
    return {
        type: ActionTypes.CentersCountUpdate,
        payload: count
    };
}

export const updateSecondaryControlAction = (id: SecondaryControlButtons): AController => {
    return {
        type: ActionTypes.SecondaryControlUpdate,
        payload: id
    };
}

export const updateNeighbourhoodAction = (epsilon: number): AController => {
    return {
        type: ActionTypes.NeighbourhoodUpdate,
        payload: epsilon
    };
}

export const updateMinPointsAction = (count: number): AController => {
    return {
        type: ActionTypes.MinimumPointsUpdate,
        payload: count
    };
}