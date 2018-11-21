/* Reducer for Login functionality */
const login = (state = [], action) => {
    switch(action.type) {
        case 'LOGIN':
            return[
                ...state,
                {
                    login_user: "John"
                }
            ];
        default:
            return state
    }
};

export default login;


// Import the TodoAction Creators and TodoActionTypes

import * as DashboardActions from './../actions/dashboardAction';

export function DashboardListReducer(state = [], action) {
    switch (action.type) {
        // Create
        case DashboardActions.CREATE_TODO_SUCCESS: {
            return [
                ...state,
                action.todo
            ];
        }
        
        //Read    
        case DashboardActions.GET_TODOS_SUCCESS: {
            
            return action.todos.data.data.docs;

        }
    }
};
