import { SET_FILTERS } from './actions';

const initialState = {
  filters: { category: '', diet: '' }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTERS:
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

export default rootReducer;