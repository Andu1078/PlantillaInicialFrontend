export interface Login{
    Usuario :string,
    Contrasena:string,
}


export interface Sesion{
    idUsuario:number,
    cedula:string,
    token:string
}