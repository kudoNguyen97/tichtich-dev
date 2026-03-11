export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface BackendProfile {
    id: string;
    userId: string;
    profileType: string;
    fullName: string;
    wallets: unknown[];
    pinCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface BackendUser {
    id: string;
    firebaseUid: string;
    email: string;
    phone: string;
    fullName: string;
    maxKidProfile: number;
    loginMethod: 'email' | 'facebook' | 'google' | 'apple';
    loginProvider: 'firebase';
    emailVerified: boolean;
    phoneVerified: boolean;
    status: string;
    profiles: BackendProfile[];
    createdAt: string;
    updatedAt: string;
}

export interface LoginPayload {
    method: 'email' | 'facebook' | 'google' | 'apple';
    provider: 'firebase';
    idToken: string;
}

export interface LoginResponse {
    userId: string;
    sessionToken: string;
    user: BackendUser;
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
