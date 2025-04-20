import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { CompartidoService } from '../../../services/compartido/compartido.service';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/Usuario/Usuario';
import { ApiResponse } from '../../../models/General/General';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    TableModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    CheckboxModule,
    FloatLabelModule,
    PanelModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    FormsModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private compartidoService: CompartidoService
  ) {}

  // Variable formulario reactivo
  formUsuario!: FormGroup;

  //Lista para usuarios
  usuarios: Usuario[] = [];

  //Variables para nombre y id de usuario seleccionado
  idUsuarioSeleccionado: number = 0;
  nombreUsuarioSeleccionado = '';

  //Variable para el usuario selecionado
  usuarioSeleccionado: any = null;


  //Lista para tipos de usuarios
  TipoUsuarios: any[] = [];

  // Lista Botones
  estadoBotones = {
    nuevo: true,
    guardar: false,
    editar: false,
    refrescar: true,
  };

  // Clases para darle estilo al boton guardar y editar
  claseBotonGuardar = 'btn';
  claseBotonEditar = 'btn';

  //Control Nuevo Usuario Y Actualizar Usuario
  estadoGrabar = false;

  //Control de tiempo para doble click
  private ultimoClick = 0;
  private clickTimeout: any;
  private DOUBLE_CLICK_DELAY = 250;
  puedeVerPagina = false;


  // modal Permisos 
  VisibilidadModalPermiso = false;

  // Lista de permisos 
  permisos: any[] = [];



  ngOnInit() {

    // Se valida si el usuario tiene el permiso usuarios
    this.validarPermiso();

    //Inicializacion del formulario
    this.formUsuario = this.fb.group({
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      apellido: [{ value: '', disabled: true }, [Validators.required]],
      documentoIdentidad: [{ value: '', disabled: true }, [Validators.required]],
      nombreUsuario: [{ value: '', disabled: true }, [Validators.required]],
      contrasena: [{ value: '', disabled: true }, [Validators.required]],
      tipoUsuario: [{ value: '', disabled: true }, [Validators.required]],
    });
    

    // Cargamos los usuarios del sistema
    this.cargarUsuarios();

    //Cargamos los tipo de usuarios
    this.TipoUsuarios = [
      { label: '', value: '' },
      { label: 'Administrador', value: 'Administrador' },
      { label: 'Usuario', value: 'Usuario' },
    ];
  }

  // Acciones de pagina

  irAInicio() {
    this.router.navigate(['/Inicio']); // Ajustá la ruta si es distinta
  }

  ControlClick(event: MouseEvent, usuario: any) {
    const horaActual = new Date().getTime();
    const tiempoUltimoClick = horaActual - this.ultimoClick;

    clearTimeout(this.clickTimeout);

    if (tiempoUltimoClick < this.DOUBLE_CLICK_DELAY) {
      // Es doble click
      this.VerPermisos(usuario);
      this.ultimoClick = 0; // Reiniciamos
    } else {
      // Esperamos por si viene otro click (doble)
      this.clickTimeout = setTimeout(() => {
        this.SeleccionarUsuario(usuario);
      }, this.DOUBLE_CLICK_DELAY);
      this.ultimoClick = horaActual;
    }
  }

  onNuevoUsuario(): void {
    //Control de botones
    this.estadoBotones = {
      nuevo: false,
      guardar: true,
      editar: false,
      refrescar: true,
    };
    this.claseBotonGuardar = 'btn AzulActivo'; // Activamos visualmente el guardar

    // Habilitamos los campos
    this.formUsuario.reset(); // Opcional, si quieres empezar en blanco
    this.formUsuario.enable(); // Habilita todos los campos

    // Estado grabar false para nuevo
    this.estadoGrabar = false;
  }

  onRefrescar(): void {
    // Control de botones Iniciales
    this.estadoBotones = {
      nuevo: true,
      guardar: false,
      editar: false,
      refrescar: true,
    };

    // Clases iniciales para guardar y editar
    this.claseBotonGuardar = 'btn';
    this.claseBotonEditar = 'btn';

    this.formUsuario.reset(); // Opcional, si quieres empezar en blanco
    this.formUsuario.disable(); // Habilita todos los campos

    // Control boton grabar estado inicial
    this.estadoGrabar = false;
  }

  onEditarUsuario(): void {
    // Control de botones editar
    this.estadoBotones = {
      nuevo: false,
      guardar: true,
      editar: false,
      refrescar: true,
    };

    this.claseBotonGuardar = 'btn AzulActivo';

    this.formUsuario.enable(); // Habilita todos los campos

    // Control boton grabar estado inicial
    this.estadoGrabar = true;
  }

  guardarUsuario() {
    if (this.formUsuario.valid) {
       
      // Para incluir campos disabled
      const formValue = this.formUsuario.getRawValue();
  
         // Construimos el DTO
      const usuarioDto = {
        Nombre: formValue.nombre,
        Apellido: formValue.apellido,
        DocumentoIdentidad: formValue.documentoIdentidad,
        NombreUsuario: formValue.nombreUsuario,
        Contrasena: formValue.contrasena,
        TipoUsuario: formValue.tipoUsuario,
      };
  
       // Crear o actualizar
      this.estadoGrabar
        ? this.actualizarUsuario(usuarioDto)
        : this.crearUsuario(usuarioDto);
  
    } else {
      this.formUsuario.markAllAsTouched();
  
      // Mapeo para mostrar nombres amigables
      const nombresCampos: { [key: string]: string } = {
        nombre: 'Nombre',
        apellido: 'Apellido',
        documentoIdentidad: 'Cédula',
        nombreUsuario: 'Usuario',
        contrasena: 'Contraseña',
        tipoUsuario: 'Tipo de Usuario',
      };
  
      const campoInvalido = Object.keys(this.formUsuario.controls).find(key => this.formUsuario.get(key)?.invalid);
  
      const nombreCampo = campoInvalido ? nombresCampos[campoInvalido] : 'algún campo';
  
      this.compartidoService.mostrarAlerta(`El campo "${nombreCampo}" no puede estar vacío.`,'warn');
  
      // Hacer foco al primer campo inválido
      if (campoInvalido) {
        const elemento = document.querySelector(`[formControlName="${campoInvalido}"]`) as HTMLElement;
        if (elemento) {
          setTimeout(() => {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            elemento.focus();
          }, 100);
        }
      }
    }
  }

  guardarPermisosUsuario() {
    const permisosIds = this.permisos
      .filter(p => p.asignado)
      .map(p => p.idPermiso);
  
    this.usuarioService.actualizarPermisosUsuario(this.idUsuarioSeleccionado, permisosIds).subscribe({
      next: (resp) => {
        this.compartidoService.mostrarAlerta(resp.mensaje, 'success');
        this.VisibilidadModalPermiso = false;
      },
      error: (error: HttpErrorResponse) => {
        // console.log('Error al actuliazar los permisos',error)
        this.compartidoService.mostrarAlerta('Error al guardar los permisos', 'error');
      }
    });
  }

  resetearIntentos(usuario: any) {
    this.usuarioService.reestablecerIntentosUsuario(usuario.idUsuario).subscribe({
      next: () => {
        this.compartidoService.mostrarAlerta('Intentos reseteados correctamente', 'success');
      },
      error: (error:HttpErrorResponse ) => {
        this.compartidoService.mostrarAlerta(error.error.mensaje, 'error');
      }
    });
  }
  
  cambiarEstadoUsuario(usuario: any) {
    const nuevoEstado = !usuario.estado;
    this.usuarioService.actualizarEstadoUsuario(usuario.idUsuario, nuevoEstado).subscribe({
      next: () => {
        usuario.estado = nuevoEstado; // Reflejamos el cambio visualmente
        this.compartidoService.mostrarAlerta(
          `El usuario ha sido ${nuevoEstado ? 'activado' : 'desactivado'}`,
          'success'
        );

        this.cargarUsuarios();
      },
      error: (error) => {
        this.compartidoService.mostrarAlerta(error, 'error');
      }
    });
  }
  
  
  

  // Funciones

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (resp) => {
        if (resp.isExitoso) {
          this.usuarios = resp.resultado.usuarios;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar usuarios:', error);
        this.compartidoService.mostrarAlerta('Error al cargar los usuarios','error');

      },
    });
  }

  crearUsuario(usuarioDto: any) {
    // Se ejecuta el servicio de crear 
    this.usuarioService.crearUsuario(usuarioDto).subscribe({
      next: (resp) => {
        if (resp.isExitoso) {
          
          // Se muestra la alerta
          this.compartidoService.mostrarAlerta(resp.mensaje, 'success');
          
          // Se reinicia el formulario
          this.formUsuario.reset();

          // Se cargar los datos de la tabla 
          this.cargarUsuarios();

          // Se reinicia el estado de los botones
          this.resetEstadoBotones();

          // Se deshabilitan los campos 
          this.deshabilitarFormulario(); 

        }
        else
        {
          this.compartidoService.mostrarAlerta(resp.mensaje, 'warn');
        }
      },
      error: (error: HttpErrorResponse) => {
        // console.error('🔥 Error en la petición:', error);
        this.compartidoService.mostrarAlerta(error.error.mensaje,'error');
      }
    });
  }
  
  actualizarUsuario(usuarioDto: any) {
  const idUsuario = this.idUsuarioSeleccionado; // o donde tengas guardado el ID del usuario a editar
    this.usuarioService.actualizarUsuario(idUsuario, usuarioDto).subscribe({
      next: (resp) => {
        if (resp.isExitoso) {

          // Se muestra el mensaje 
          this.compartidoService.mostrarAlerta(resp.mensaje, 'success');
          
           // Se reinicia los controles 
          this.formUsuario.reset();

          // Se carga la tabla de usuarios 
          this.cargarUsuarios();

          // Se restablecen los botones
          this.resetEstadoBotones();

          // Se deshabilitan los campos 
          this.deshabilitarFormulario(); 
        } else {
          this.compartidoService.mostrarAlerta(resp.mensaje, 'warn');
        }
      },
      error: (error: HttpErrorResponse) => {
        // console.error('🔥 Error al actualizar usuario:', error);
        this.compartidoService.mostrarAlerta('Error al conectar con el servidor','error');
      }
    });
  }
  
  SeleccionarUsuario(usuario: any) {
    // Llenamos el formulario
    this.formUsuario.patchValue({
      documentoIdentidad: usuario.documentoIdentidad,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nombreUsuario: usuario.nombreUsuario,
      contrasena: usuario.contrasena,
      tipoUsuario: usuario.tipoUsuario,
    });

    //Control de botones
    this.estadoBotones = {
      nuevo: false,
      guardar: false,
      editar: true,
      refrescar: true,
    };

    //Actualizamos el usuario seleccionado
    this.usuarioSeleccionado = usuario;

    // Selecionamos el ID del Usuario
    this.idUsuarioSeleccionado = usuario.idUsuario;

    this.claseBotonEditar = 'btn AzulActivo'; // Activamos visualmente el guardar
  }

  VerPermisos(usuario: any) {
    // Mostrar modal con CRUD de permisos
    this.VisibilidadModalPermiso = true;
  
    this.nombreUsuarioSeleccionado = usuario.nombreUsuario;
    this.idUsuarioSeleccionado = usuario.idUsuario;

    forkJoin({
      todos: this.usuarioService.obtenerTodosPermisos(),
      asignados: this.usuarioService.obtenerPermisoPorUsuario(this.idUsuarioSeleccionado)
    }).subscribe({
      next: ({ todos, asignados }) => {
       
        const permisosAsignadosIds = asignados.resultado.permisos.map((p: any) => p.idPermiso);
  
        this.permisos = todos.resultado.permisos.map((permiso: any) => ({
          ...permiso,
          asignado: permisosAsignadosIds.includes(permiso.idPermiso)
        }));
      },
      error: (error: HttpErrorResponse) => {
        // console.error('🚨 Error cargando permisos:', error);
        this.compartidoService.mostrarAlerta('Error al cargar los permisos', 'error');
      }
    });
  }

  resetEstadoBotones() {
    this.estadoBotones = {
      nuevo: true,
      guardar: false,
      editar: false,
      refrescar: true,
    };
  }

  private deshabilitarFormulario(): void {
    Object.keys(this.formUsuario.controls).forEach((campo) => {
      this.formUsuario.get(campo)?.disable();
    });
  }

  validarPermiso(){
    const idUsuario = this.compartidoService.obtenerIdUsuario();
  
    this.usuarioService.obtenerPermisoPorUsuario(idUsuario).subscribe({
      next: (resp: ApiResponse) => {
        if (resp.isExitoso) {
          const permisos = resp.resultado.permisos as { idPermiso: number }[];
  
          // Validamos si el usuario tiene el permiso
          const tienePermiso = permisos.some(p => p.idPermiso === 1);
  
          if (!tienePermiso) {
            this.router.navigate(['Inicio']);
          }else{
            this.puedeVerPagina = true;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        
        this.compartidoService.mostrarAlerta('Error al cargar los permisos','error' );
      },
    });
  }
  
 
  
}
