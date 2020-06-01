import Swal from 'sweetalert2';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';
import { Hospital } from './../../models/hospital.model';
import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/service.index';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarHospitales());
  }

  mostralModal( id: string ) {
    this._modalUploadService.mostralModal( 'hospitales', id );
  }
  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
    .subscribe( (resp: any) => {
      console.log(resp);
      this.hospitales = resp.hospitales;
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
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
    }
    this.cargando = true;
    this._hospitalService.buscarHospital( termino )
    .subscribe( (hospitales: Hospital[]) => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  borrarHospital( hospital: Hospital ) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((borrar) => {
      if (borrar.value) {
        this._hospitalService.borrarHospital( hospital._id)
        .subscribe( resp => this.cargarHospitales());
      }
    });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
    .subscribe();
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear hospital',
      input: 'text',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log(result);
      const valor = result.value as string;
      if ( !valor || valor.length === 0) {
        return;
      }
      if (result.isConfirmed === false) {
        return;
      }

      this._hospitalService.crearHospital(valor)
      .subscribe(() => this.cargarHospitales());
    });
  }
}
