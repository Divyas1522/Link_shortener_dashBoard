import { createContext, useState } from 'react';

export const AuthDataContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState({
    email:"",
    password:"",
  });

  return (
    <AuthDataContext.Provider value={{ user, setUser }}>
      {children}
    </AuthDataContext.Provider>
  );
};

export default AuthContext;