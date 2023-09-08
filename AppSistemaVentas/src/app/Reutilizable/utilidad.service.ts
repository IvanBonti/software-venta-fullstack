import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import {Sesion} from '../interfaces/sesion';


@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar) { }

  mostrarAlerta(mensaje:string, tipo:string){
    this._snackBar.open(mensaje,tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }

  guardarSesionUsuario(Usuariosesion:Sesion){
    localStorage.setItem('usuario',JSON.stringify(Usuariosesion));
  }

  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem('usuario');
    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }
 
  eliminarSesionUsuario(){
    localStorage.removeItem('usuario');
  }
}