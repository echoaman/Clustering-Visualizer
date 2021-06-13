import { combineReducers } from "redux";
import { algorithmsReducer } from "./algorithmsReducer";
import { canvasReducer } from "./canvasReducer";
import { controllerReducer } from "./controllerReducer";

export const rootReducer = combineReducers({
    canvas: canvasReducer,
    algorithms: algorithmsReducer,
    controller: controllerReducer
});

export type AppState = ReturnType<typeof rootReducer>;