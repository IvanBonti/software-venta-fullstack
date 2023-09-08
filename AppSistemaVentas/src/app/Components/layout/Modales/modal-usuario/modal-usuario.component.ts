import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';

import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';



@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})


export class ModalUsuarioComponent implements OnInit {
  //Creacion de variables
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    //Para que reconozca como modal
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    //Componente para recibir datos
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    //Nos permite crear campos del form
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    //Creamos los campos de nuestro form
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['',Validators.required],
      correo: ['',Validators.required],
      idRol: ['',Validators.required],
      clave: ['',Validators.required],
      esActivo: ['1',Validators.required]
    });

    if(datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    //Obtener roles para pintar en el desplegable
    this._rolServicio.lista().subscribe({
      next: (data) => {
        if(data.status) this.listaRoles = data.value
        },
        error:(e) => {}
    })
  }

  //Metodo que se ejecuta para pintar toda la informacion de usuario
  ngOnInit(): void {
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      })
    }
      
  }
  //Metodo para crear un usuario o editar
  guardarEditar_Usuario(){
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo) 
    }

      // Ejecutar el servicio para guardar o editar
      if (this.datosUsuario == null) {
        this._usuarioServicio.guardarUsuario(_usuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El usuario fue registrado", "Exito");
              this.modalActual.close("true");
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario", "Error");
            }
          },
          error: (e) => {}
        });
      } else {
        this._usuarioServicio.editar(_usuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El usuario fue actualizado", "Exito");
              this.modalActual.close("true");
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo actualizar el usuario", "Error");
            }
          },
          error: (e) => {}
        });
      }
    }
  }