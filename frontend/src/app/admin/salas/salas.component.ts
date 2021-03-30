import { Component, OnInit } from '@angular/core';
import { MysqlService } from './../../services/mysql.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styles: []
})
export class SalasComponent implements OnInit {

  public salas = [];
  public tuplaId = null;
  public currentStatus = 1;

  public newSalaForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required)
  });

  constructor(private mysqlService: MysqlService) {
    this.newSalaForm.setValue({
      id: '',
      nombre: '',
      imagen: ''
    });
   }

  ngOnInit(): void {
    document.getElementById('uno').style.display = 'none';
    document.getElementById('dos').style.display = 'none';
    document.getElementById('tres').style.display = 'none';
    this.actualizar();
  }

  public actualizar() {
    this.mysqlService.consulta(`${environment.API_URL}/salas`)
      .subscribe((res: any) => {
        console.log(res);
        this.salas = res.array;
      });
  }

  public newSala(form, tuplaId = this.tuplaId) {
    if (this.newSalaForm.valid) {
      if (this.currentStatus == 1) {
        let data = {
          nombre: form.nombre,
          imagen: form.imagen
        };

        this.mysqlService.alta(`${environment.API_URL}/sala`, data)
        .then((laData) => {
          document.getElementById('dos').style.display = 'block';
          setTimeout(() => document.getElementById('dos').style.display = 'none', 5000);
          this.newSalaForm.setValue({
            id: '',
            nombre: '',
            imagen: ''
          });
          this.actualizar();
        })
        .catch((err) => {
          console.log(err);
        });

      } else {
        let data = {
          id: tuplaId,
          nombre: form.nombre,
          imagen: form.imagen
        };

        this.mysqlService.cambio(`${environment.API_URL}/sala`, data)
          .subscribe((res: any) => {
            console.log(res);
            this.currentStatus = 1;
            this.newSalaForm.setValue({
              id: '',
              nombre: '',
              imagen: ''
            });
            document.getElementById('dos').style.display = 'block';
            setTimeout(() => document.getElementById('dos').style.display = 'none', 5000);
            this.actualizar();
          });
      }
    } else {
      document.getElementById('uno').style.display = 'block';
      setTimeout(() => document.getElementById('uno').style.display = 'none', 5000);
    }
  }

  public editSala(tuplaId) {
    this.mysqlService.consultaId(`${environment.API_URL}/sala/${tuplaId}` )
      .subscribe((res: any) => {
        console.log(res);
        this.currentStatus = 2;
        this.tuplaId = res.id[0].id;
        this.newSalaForm.setValue({
          id: tuplaId,
          nombre: res.id[0].nombre,
          imagen: res.id[0].imagen
        });
      });
  }

  public deleteSala(tuplaId) {
    this.mysqlService.delete(`${environment.API_URL}/sala/${tuplaId}`)
      .subscribe((res: any) => {
        console.log(res);
        this.actualizar();
        document.getElementById('tres').style.display = 'block';
        setTimeout(() => document.getElementById('tres').style.display = 'none', 5000);
    });
  }


  cerrar(alerta: string) {
    document.getElementById(alerta).style.display = 'none';
  }
}
