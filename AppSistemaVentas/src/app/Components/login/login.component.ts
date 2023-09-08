import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin:FormGroup;
  ocultarPassword:boolean = true;
  mostrarLoading:boolean = false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _usaurioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService

  ){
    this.formularioLogin = this.fb.group({
      email:['', Validators.required],
      password:['', Validators.required]
    })
  } 

  ngOnInit():void{
  }

  iniciarSesion() {
    this.mostrarLoading = true;
  
    // Esto lo recibe la api
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };

    
    this._usaurioServicio.iniciarSesion(request).subscribe({
      next: data => {
        if (data.status) {
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias", "Error");
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta("Ha ocurrido un error", "Error");
        this.mostrarLoading = false;
      }
    });
  }
}  