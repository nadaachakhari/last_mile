// Exemple de reducer pour l'authentification
const initialState = {
  isAuthenticated: false,  // Valeur par défaut
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,  // Vous pouvez stocker les informations de l'utilisateur ici
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;

