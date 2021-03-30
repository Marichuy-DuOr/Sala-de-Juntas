//Muestra la informacion de sala seleccionada 
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MysqlService } from '../services/mysql.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styles: []
})
export class SalaComponent implements OnInit {

  sala: any;
  reservaciones: any;
  public disponibilidad;
  public ff;
  hour:any;
  minute:any;
  public fecha;
  public band;
  public bDelete;

  public newReservacionForm = new FormGroup({
    hora: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    min: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    evento: new FormControl('', Validators.required)
  });

  @Input() idDoc: any;

  constructor(private activatedRoute: ActivatedRoute, private mysqlService: MysqlService, 
              private configAlert: NgbAlertConfig, private router: Router) { 
                configAlert.dismissible = true;
                this.activatedRoute.params.subscribe( params => {
                  this.idDoc = params['id'];
                });

                this.newReservacionForm.setValue({
                  hora: '',
                  min: '',
                  evento:''
                });
  }
//Se obtiene la sala para saber si esta ocupada o desocupada
  ngOnInit(): void {
    this.mysqlService.consultaId(`${environment.API_URL}/sala/${this.idDoc}` )
    .subscribe((res: any) => {
      console.log(res);
      this.sala = res.id[0];
      if(this.sala.ocupada === 1) {
        this.disponibilidad = "Ocupada";
      }else{
        this.disponibilidad = "Disponible";
      }
    });
    //Se obtiene la reservacion de la sala
    this.mysqlService.consultaId(`${environment.API_URL}/verReservaciones/${this.idDoc}` )
    .subscribe((res: any) => {
      console.log(res);
      this.reservaciones = res.id[0];
    });
    
  }
//Si la sala esta desocupada se registra la hora de termino y el evento 
  public newReservacion(form) {
    let currentDate = new Date();
  
    let day:any = currentDate.getDate();
    let month:any = currentDate.getMonth() + 1;
    let year:any = currentDate.getFullYear();
  
    if(day<10){
      day = "0" + day.toString();
    }
    if(month<10){
      month = "0" + month.toString();
    }
    //Se verifica que no sean mas de dos horas
    this.band = 0;
    this.ff = year+"-"+month+"-"+day+" "+form.hora+":"+form.min+":00";
    this.crearFecha();
    if(form.min < 60){
      if((form.hora-this.hour) === 2 && form.min <= this.minute){
        this.band = 1;
      }else if((form.hora-this.hour) < 2){
        this.band = 1;
      }
    }
    //Se verifica que los datos sean correctos
    if (this.newReservacionForm.valid && this.band === 1) {
      if(this.ff > this.fecha){
        let data = {
          idSala: this.sala.id,
          inicio_reunion: this.fecha,
          fin_reunion: this.ff,
          evento: form.evento
        };
        //Da de alta la reservacion
        this.mysqlService.alta(`${environment.API_URL}/reservacion`, data)
        .then((laData) => {
          console.log(laData);
          this.newReservacionForm.setValue({
            hora: '',
                  min: '',
                  evento:''
          });
          //Pone la sala a ocupada
          let data = {
            id: this.sala.id,
            nombre: this.sala.nombre,
            ocupada: 1,
            imagen: this.sala.imagen
          };
          this.mysqlService.cambio(`${environment.API_URL}/updSala`, data)
          .subscribe((res: any) => {
            console.log(res);
          });

          this.router.navigate(['home']);
        })
        .catch((err) => {
          console.log(err);
        });
  //Si los datos no son correctos muestra mensaje
      } else{
        document.getElementById('uno').style.display = 'block';
        setTimeout(() => document.getElementById('uno').style.display = 'none', 3000);
       }
    }else{
          document.getElementById('uno').style.display = 'block';
          setTimeout(() => document.getElementById('uno').style.display = 'none', 3000);
    }
  }
  //Al presionar el boton de terminar reservacion, elimina la reservacion y libera la sala
  public delete(){
    let data = {
      id: this.sala.id,
      nombre: this.sala.nombre,
      ocupada: 0,
      imagen: this.sala.imagen
    };
    this.mysqlService.cambio(`${environment.API_URL}/updSala`, data)
    .subscribe((res: any) => {
      console.log(res);
    });
    this.mysqlService.delete(`${environment.API_URL}/reservacion/${this.reservaciones.id}`)
                .subscribe((res: any) => {
                    console.log("Reservacion eliminada");
                    
                });
                this.router.navigate(['home']);        
  }
//Funcion para la fecha del sistema
  public crearFecha(){
    let currentDate = new Date();
  
    this.hour = currentDate.getHours();
    this.minute = currentDate.getMinutes();
    let second:any = currentDate.getSeconds();
    let day:any = currentDate.getDate();
    let month:any = currentDate.getMonth() + 1;
    let year:any = currentDate.getFullYear();
  
    if(this.hour<10){
      this.hour = "0" + this.hour.toString();
    }
    if(this.minute<10){
      this.minute = "0" + this.minute.toString();
    }
    if(second<10){
      second = "0" + second.toString();
    }
    if(day<10){
      day = "0" + day.toString();
    }
    if(month<10){
      month = "0" + month.toString();
    }
    this.fecha = year+"-"+month+"-"+day+" "+this.hour+":"+this.minute+":"+second;
  }

  cerrar(alerta: string) {
    document.getElementById(alerta).style.display = 'none';
  }

}


interface reservacion {
    id: string;
    idSala: string;
    idUsuario: string;
    inicio: string;
    fin: string;
    evento: string;
}

