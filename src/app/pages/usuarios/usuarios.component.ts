import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/service.index';
import { URL_SERVICE } from './../../config/config';
import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());
  }

  mostralModal( id: string ) {
    this._modalUploadService.mostralModal( 'usuarios', id );
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.totalRegistros = resp.total;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros) {
      return;
    }

    if ( desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
    }
    this.cargando = true;
    this._usuarioService.buscarUsuario( termino )
    .subscribe( (usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioService.usuario._id) {
      Swal.fire({
        icon: 'error',
        title: 'No puede borrar usuario',
        text: 'No se puede borrar a sí mismo'
      });
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Está a punto de borrar a '+ usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((borrar) => {
      if (borrar.value) {
        this._usuarioService.borrarUsuario( usuario._id)
        .subscribe( resp => {
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario( usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
    .subscribe();
  }
}
