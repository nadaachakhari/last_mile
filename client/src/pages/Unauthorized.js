import React from 'react';
import { useAuth } from '../Middleware/Use_Auth';
const Unauthorized = () => {
  const { role } = useAuth(); 

  return (
    <div>
      <h1>Accès non autorisé</h1>
      {/* <p>Votre rôle actuel est : {role}</p> */}
    </div>
  );
};

export default Unauthorized;
