// import { Injectable } from '@angular/core';

import{HttpClient} from '@angular/common/http';
import{Observable} from 'rxjs';
import{environment} from 'src/environments/environment.development';
import{ResponseApi} from '../interfaces/response-api';
import{Venta} from '../interfaces/venta';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class VentaService {

  private urlApi: string = environment.endpoint + "/Venta/";

  constructor(private http: HttpClient) { }

  registrar(request: Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }

  historial(buscarPor: string, numeroVenta:number, fechaInicio: Date, fechaFin:Date):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }

  reporte(fechaInicio: string, fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }
}
