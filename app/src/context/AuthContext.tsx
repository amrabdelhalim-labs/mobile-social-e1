import { createContext, useEffect, useState, type ReactNode } from 'react';
import { IonLoading } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';

interface AuthContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    jwt: string | null;
    setJwt: (value: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    loggedIn: false,
    setLoggedIn: () => { },
    jwt: null,
    setJwt: () => { },
});

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        getAuthenticated();
    }, []);

    const getAuthenticated = async () => {
        try {
            const { value } = await Preferences.get({ key: 'accessToken' });
            if (value) {
                setLoggedIn(true);
                setJwt(value);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setLoggedIn(false);
        } finally {
            setShowLoading(false);
        }
    };

    if (showLoading) {
        return <IonLoading isOpen={showLoading} message="جار التحميل..." />;
    }

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, jwt, setJwt }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
