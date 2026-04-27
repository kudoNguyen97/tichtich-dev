import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export function useFirebaseAuthSync() {
    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
            const { isAuthenticated, logout } = useAuthStore.getState();
            if (!firebaseUser && isAuthenticated) {
                logout();
                window.location.replace('/login');
            }
        });
        return unsubscribe;
    }, []);
}
