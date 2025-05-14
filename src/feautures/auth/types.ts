export interface loginResponse {
    email: string;
    password: string;
}
export interface RegisterResponse extends loginResponse {
    username: string;
    first_name: string;
    last_name: string;
    
}
export interface Errors{
    status:number;
    data:any
}
export interface UserType{
    username:string, 
    first_name:string, 
    last_name:string,
    email:string,
    avatar:string
}