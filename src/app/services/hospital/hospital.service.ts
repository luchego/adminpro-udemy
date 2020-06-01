import { Hospital } from './../../models/hospital.model';
import Swal from 'sweetalert2';
import { UsuarioService } from './../usuario/usuario.service';
import { map } from 'rxjs/operators';
import { URL_SERVICE } from './../../config/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales(desde: number = 0) {
    const url = URL_SERVICE + '/hospital?desde=' + desde;

    /*return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalHospitales = resp.total;
        return resp.hospitales;
      })
    );*/
    return this.http.get( url );
  }

  obtenerHospital(id: string) {
    const url = URL_SERVICE + '/hospital/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.hospital)
    );
  }

  borrarHospital(id: string) {
    let url = URL_SERVICE + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
    .pipe(map( resp => {
      Swal.fire(
        'Hospital borrado',
        'El hospital ha ido eliminado correctamente.',
        'success'
      );
      return true;
    }));
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICE + '/hospital';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, {nombre})
    .pipe(map((resp: any) => resp.hospital));
  }

  buscarHospital(termino: string) {
    const url = URL_SERVICE + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url ).pipe(
      map( (resp: any) => resp.hospitales)
    );
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICE + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url , hospital)
    .pipe(map( (resp: any) => {
      Swal.fire(
        'Hospital actualizado',
        hospital.nombre,
        'success'
      );
      return resp.hospital;
    }));
  }
}
