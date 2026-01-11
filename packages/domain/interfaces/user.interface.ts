export interface User {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
    profileImageKey?: string;
    status: string;
    createdAt: Date;
}
