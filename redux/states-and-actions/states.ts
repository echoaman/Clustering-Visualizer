import { Algos, SecondaryControlButtons } from "../../lib/enums";
import { Point } from "../../lib/Point";

export type SAlgorithms = {
    SelectedAlgorithm: Algos,
    IsAppRunning: boolean
};

export type SCanvas = {
    Data: Point[],
    Centers: Point[]
};

export type SController = {
    DataCount: number,
    CentersCount: number,
    SecondaryControl: SecondaryControlButtons
};