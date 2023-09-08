import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
//Para mostrar alertas personalizadas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{
  //Variables
  columnasTabla: string[] = ['NombreCompleto', 'correo', 'rolDescripcion','estado','acciones'];
  //Inicializar origen de datos
  dataInicio: Usuario[] =[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}
  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if(data.status)
        this.dataListaUsuarios = data.value;
        else
        this._utilidadServicio.mostrarAlerta("No se encontaron datos","Error")
        },
        error:(e) => {}
    })

  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  //Metodo para aplicar filtros en las busquedas
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  //Metodo para crear nuevo usuario
  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true, //No se puede cerrar el modal dando clic fuera de el
    }).afterClosed().subscribe((resultado) => {
      if(resultado ==="true"){
        this.obtenerUsuarios();
      }
    });
  }

  //Metodo para editar usuario
  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe((resultado) => {
      if(resultado ==="true"){
        this.obtenerUsuarios();
      }
    });
  }

  //Metodo para eliminar Usuario
  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: "Esta accion no se puede revertir",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Exito");
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario","Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
