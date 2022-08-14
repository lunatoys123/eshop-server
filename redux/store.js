import { createStore, combineReducers, applyMiddleware } from "redux";
import ThunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import cartItems from "./reducers/CartItem";

const reducers = combineReducers({
  cartItems: cartItems,
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(ThunkMiddleware))
);

export default store;
