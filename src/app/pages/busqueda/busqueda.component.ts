import { Usuario } from './../../models/usuario.model';
import { Medico } from './../../models/medico.model';
import { Hospital } from './../../models/hospital.model';
import { URL_SERVICE } from './../../config/config';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activateRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    activateRoute.params.subscribe(params => {
      let termino = params['termino'];
      this.buscar(termino);
    });
  }

  ngOnInit(): void {
  }

  buscar( termino: string) {
    let url = URL_SERVICE + '/busqueda/todo/' + termino;

    this.http.get( url )
    .subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
    });
  }
}
