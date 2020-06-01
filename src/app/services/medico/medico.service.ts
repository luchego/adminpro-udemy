import { UsuarioService } from './../usuario/usuario.service';
import { Medico } from './../../models/medico.model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICE } from 'src/app/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0){
    const url = URL_SERVICE + '/medico?desde=' + desde;

    return this.http.get( url );
  }

  buscarMedico(termino: string) {
    const url = URL_SERVICE + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url ).pipe(
      map( (resp: any) => resp.medicos)
    );
  }

  borrarMedico(id: string) {
    let url = URL_SERVICE + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
    .pipe(map( resp => {
      Swal.fire(
        'Medico borrado',
        'El medico se ha ido eliminado correctamente.',
        'success'
      );
      return true;
    }));
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICE + '/medico' ;
    if ( medico._id ) {
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico ).pipe(
        map( (resp: any) => {
          Swal.fire(
            'Medico Actualizado',
             medico.nombre,
            'success'
          );
          return resp.medico;
        })
      );
    } else {
      url += '?token=' + this._usuarioService.token;

      return this.http.post( url, medico ).pipe(
        map( (resp: any) => {
          console.log(resp);
          Swal.fire(
            'Medico creado',
             medico.nombre,
            'success'
          );
          return resp.medico;
        })
      );
    }
  }

  cargarMedico( id: string ) {
    const url = URL_SERVICE + '/medico/' + id;

    return this.http.get( url )
    .pipe( map(
    (resp: any) => resp.medico
    ));
  }
}
