export interface Usuario {
    idUsuario:          number;
    nombre:             string;
    apellido:           string;
    documentoIdentidad: string;
    nombreUsuario:      string;
    contrasena:         string;
    tipoUsuario:        string;
    estado:             boolean;
}

// Crear Usuario y Actualizar
export interface CrearActualizarUsuarioDto {
    Nombre: string;
    Apellido: string;
    DocumentoIdentidad: string;
    NombreUsuario: string;
    Contrasena: string;
    TipoUsuario: string;
  }
  