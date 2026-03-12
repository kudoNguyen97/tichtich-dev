export interface Profile {
    id: string;
    userId: string;
    profileType: 'adult' | 'kid';
    fullName: string;
    wallets: unknown[];
    pinCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    firebaseUid: string;
    email: string;
    phone: string;
    fullName: string;
    maxKidProfile: number;
    loginMethod: 'email' | 'facebook' | 'google' | 'apple';
    loginProvider?: 'firebase';
    emailVerified?: boolean;
    phoneVerified?: boolean;
    status: string;
    profiles: Profile[];
    // createdAt: string;
    // updatedAt: string;
}

export interface LoginPayload {
    method: 'email' | 'facebook' | 'google' | 'apple';
    provider: 'firebase';
    idToken: string;
}

export interface LoginResponse {
    userId: string;
    sessionToken: string;
    user: User;
}

export interface SignupPayload {
    method: 'email' | 'facebook' | 'google' | 'apple';
    provider: 'firebase';
    idToken: string;
    fullName: string;
    phoneNumber?: string;
    parentGender: 'male' | 'female';
}

export interface SignupResponse {
    user: any;
}
