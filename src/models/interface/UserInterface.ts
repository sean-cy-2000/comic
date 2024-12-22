export interface UserInterface {
    name: string;
    email: string;
    point: number;
    user_id: number;
}

export interface UserResponseInterface {
    success: boolean;
    message?: string;
    user?: UserInterface;
}