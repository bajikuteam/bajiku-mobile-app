import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a type for your context value
interface FollowerContextType {
    totalFollowers: number;
    setTotalFollowers: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with a default value
const FollowerContext = createContext<FollowerContextType | undefined>(undefined);

export const FollowersProvider = ({ children }: { children: ReactNode }) => {
    const [totalFollowers, setTotalFollowers] = useState(0);

    return (
        <FollowerContext.Provider value={{ totalFollowers, setTotalFollowers }}>
            {children}
        </FollowerContext.Provider>
    );
};

export const useFollowers = () => {
    const context = useContext(FollowerContext);
    if (context === undefined) {
        throw new Error('useFollowers must be used within a FollowerProvider');
    }
    return context;
};
