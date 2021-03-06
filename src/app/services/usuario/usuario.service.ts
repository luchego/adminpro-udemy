
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { URL_SERVICE } from './../../config/config';
import { Usuario } from './../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = {};

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICE + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
      .pipe(
        map(
          (resp: any) => {
            this.token = resp.token;
            localStorage.setItem('token', this.token);

            return true;
          }
        ),
        catchError(err => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo renovar token',
            text: 'No fue posible renovar el token'
          });
          return throwError(err);
        })
      );
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario =  usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string) {
    const url = URL_SERVICE + '/login/google';

    return this.http.post( url, {token})
    .pipe(map( (resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }));
  }

  estaLogueado() {
    return (this.token.length > 5) ? true: false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICE + '/login';

    return this.http.post( url, usuario ).pipe(
      map((resp: any) => {
        console.log(resp);

        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
      catchError(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el login',
          text: err.error.mensaje
        });
        return throwError(err);
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICE + '/usuario';
    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: usuario.email
      });
      return resp.usuario;
    }),
    catchError(err => {
      Swal.fire({
        icon: 'error',
        title: err.error.mensaje,
        text: err.errors.message
      });
      return throwError(err);
    }));
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICE + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
    .pipe(
      map((resp: any) => {
        console.log(resp);

        if ( usuario._id ===  this.usuario._id) {
          const usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }

        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: usuario.nombre
        });

        return true;
      }),
      catchError(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: err.error.mensaje,
          text: err.error.errors.message
        });
        return throwError(err);
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      Swal.fire({
        icon: 'success',
        title: 'Imagen Actualizada',
        text: this.usuario.nombre
      });
      this.guardarStorage(id, this.token, this.usuario, this.menu);
    }).catch( resp => {
      console.log(resp);
    });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICE + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuario(termino: string) {
    let url = URL_SERVICE + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url ).pipe(
      map( (resp: any) => resp.usuarios)
    );
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICE + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete( url )
    .pipe(map( resp => {
      Swal.fire(
        'Usuario borrado',
        'El usuario a sido eliminado correctamente.',
        'success'
      );
      return true;
    }));
  }
}
