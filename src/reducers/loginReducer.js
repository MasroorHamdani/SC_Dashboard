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