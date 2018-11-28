import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import redixMulti from 'redux-multi';
import rootReducer from "../reducers/RootReducers"

const createAppStore = compose(applyMiddleware(thunkMiddleware, redixMulti))(createStore);

export default function configureStore(initialState) {
    // const isDev = process.env.NODE_ENV === "development";

    let store = createAppStore(
        rootReducer,
        initialState,
        window.devToolsExtension && window.devToolsExtension()
        // isDev ? window.devToolsExtension && window.devToolsExtension() : undefined
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/RootReducers.js', () => {
            const nextReducer = require("./../reducers/RootReducers.js").default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}