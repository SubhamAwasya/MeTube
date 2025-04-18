import { createContext, useContext, useEffect, useState } from "react";

// Create context
const UserContext = createContext(null);

// Custom hook to use the context easily
export const useUser = () => useContext(UserContext);

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login and logout handlers
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
