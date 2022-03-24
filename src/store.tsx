import { applyMiddleware, combineReducers, createStore } from "redux";

import rd from "./reducer";
import thunk from "./thunk";

const stateFromServer = {};

const reducer = combineReducers({
   rd
});

export type RootState = ReturnType<typeof reducer>;

declare module "react-redux" {
    interface DefaultRootState extends RootState {}
}

export default createStore(reducer, stateFromServer, applyMiddleware(thunk));