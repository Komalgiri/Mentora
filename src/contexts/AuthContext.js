import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password, username) {
        return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
            // Update the profile with the username immediately after signup
            if (username) {
                await updateProfile(result.user, {
                    displayName: username
                });
                // Force reload user to get the updated display name
                await result.user.reload();
                setCurrentUser(auth.currentUser);
            }
            return result;
        });
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        googleLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
