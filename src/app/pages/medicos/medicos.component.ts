import { MedicoService } from './../../services/medico/medico.service';
import Swal from 'sweetalert2';
import { Medico } from './../../models/medico.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;
  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde)
    .subscribe( (resp: any) => {
      console.log(resp);
      this.medicos = resp.medicos;
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
    this.cargarMedicos();
  }

  buscarMedico(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
    }
    this.cargando = true;
    this._medicoService.buscarMedico( termino )
    .subscribe( (medicos: Medico[]) => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((borrar) => {
      if (borrar.value) {
        this._medicoService.borrarMedico( medico._id)
        .subscribe( resp => this.cargarMedicos());
      }
    });
  }

}
