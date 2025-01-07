import { createStore, combineReducers } from 'redux';
import authReducer from './redux/reducers/auth/index';

const rootReducer = combineReducers({
  auth: authReducer,
  // Ajoutez d'autres reducers ici
});

const store = createStore(rootReducer);

export default store;
