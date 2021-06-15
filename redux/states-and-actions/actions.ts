import { Algos, SecondaryControlButtons } from "../../lib/enums";
import { Point } from "../../lib/Point";
import { ActionTypes } from "./action-types";

// Algorithms

interface IUpdateSelectedAlgorithm {
    type: ActionTypes.AlgorithmUpdate,
    payload: Algos
};

interface IAppRunningToggle {
    type: ActionTypes.AppRunningToggle
}

export type AAlgorithms = IUpdateSelectedAlgorithm | IAppRunningToggle;

// Canvas

interface IUpdatePointsList {
    type: ActionTypes.DataListUpdate | ActionTypes.CentersListUpdate,
    payload: Point[]
};

export type ACanvas = IUpdatePointsList;

// Controller

interface IUpdatePointsCount {
    type: ActionTypes.DataCountUpdate | ActionTypes.CentersCountUpdate,
    payload: number
};

interface IUpdateSecondaryControl {
    type: ActionTypes.SecondaryControlUpdate,
    payload: SecondaryControlButtons
};

export type AController = IUpdatePointsCount | IUpdateSecondaryControl;

