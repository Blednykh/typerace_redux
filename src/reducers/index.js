import {combineReducers} from 'redux';
import recordsReducers from './records';

const appReducers = combineReducers({
    records: recordsReducers
});
export default appReducers;
