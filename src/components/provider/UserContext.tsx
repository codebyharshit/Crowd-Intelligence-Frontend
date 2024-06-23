import { Dispatch, createContext, useContext, useState } from "react";

interface UserContextType {
    userData: UserDataType | null;
    setUserData: Dispatch<React.SetStateAction<UserDataType | null>>;
}

interface UserDataType {
    userId: string | null;
    userRole: string | null;
    userLevel: string | null;
    userPoints: number | null;
}

// The UserContext object is used to provide the user data to the components in the application.
// createContext creates a context object that can be used to access the UserContext object.
const UserContext = createContext<UserContextType>({ userData: null, setUserData: () => {} });

// UserProvider is a component that provides the UserContext to its children.
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState<UserDataType | null>({
        userId: null,
        userRole: null,
        userLevel: null,
        userPoints: null,
    });
    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}

// useUserContext is a custom hook that returns the UserContext object.
// This hook can be used in functional components to access the UserContext object.
export const useUserContext = () => useContext(UserContext);