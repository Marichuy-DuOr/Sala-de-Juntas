import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MysqlService } from './../services/mysql.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DatePipe } from "@angular/common";
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
//Se construyen dos arreglos uno para las salas disponibles y otro para las ocupadas 
  public salasOcupadas = [];
  public salasDisponibles = [];
  public reservacion = [];
  hour:any; //Variables para obtener la hora del sistema
  minute:any;
  public fecha;
  public ho;
  
  constructor(private router: Router, private mysqlService: MysqlService, private datePipe: DatePipe) { }
//Redirecciona para hacer la reserva o para terminar la reserva 
  verInformacion(item: any){
    this.router.navigate([ '/sala', item ]);
  }

  ngOnInit(): void {
    this.actualizar();
  }
//Libera las salas que se van desocupando 
  public actualizar() {
    this.mysqlService.consulta(`${environment.API_URL}/salas`)
      .subscribe((res: any) => {
        console.log(res);

        res.array.forEach(element => {
          //Si la sala esta ocupada hace la liberacion
          if(element.ocupada === 1 ){
          //Obtiene todas las reservaciones
            this.mysqlService.consultaId(`${environment.API_URL}/verReservaciones/${element.id}` )
            .subscribe((res: any) => {
              console.log(res.id[0]);
                this.crearFecha();
                let h = res.id[0].fin_reunion;
                //La hora final la obtiene para saber si ya termino el tiempo
                let myMoment = moment(h).format('YYYY-MM-DD hh:mm:ss');
                let myHora =  moment(myMoment).format('hh');
                let myMinute = moment(myMoment).format('mm');

                let horaBD = (Number(myHora)+12) +":" +Number(myMinute);
                //Compara si la hora de la reservacion es menor con la actual
                //Si es menor o igual quiere decir que ya se termino el tiempo
                if(horaBD <= (this.hour+":"+this.minute)){
                  let dato = {
                    id: element.id,
                    nombre: element.nombre,
                    ocupada: 0,
                    imagen: element.imagen
                  };
                  //Libera la sala y elimina la reservacion 
                  this.mysqlService.cambio(`${environment.API_URL}/updSala`, dato)
                  .subscribe((res: any) => {
                    console.log(res);
                  });
                  console.log(element.id);
                  this.mysqlService.delete(`${environment.API_URL}/reservacion/${res.id[0].id}`)
                      .subscribe((res: any) => {
                          console.log("Reservacion eliminada");
                          
                      });
                      const data: sala = {
                        id: element.id,
                        nombre: element.nombre,
                        ocupada: element.ocupada,
                        imagen: element.imagen 
                      };
                      this.salasDisponibles.push(data);
                }else if(horaBD > (this.hour+":"+this.minute)){
                  // Si es mayor la hora de la reservacion, aun no se le termina el tiempo para ser liberada
                  const data: sala = {
                    id: element.id,
                    nombre: element.nombre,
                    ocupada: element.ocupada,
                    imagen: element.imagen  
                  };
                  this.salasOcupadas.push(data);
                }
            });
          } else{ //Si no esta ocupada lo almacena en salas disponibles
            const data: sala = {
              id: element.id,
              nombre: element.nombre,
              ocupada: element.ocupada,
              imagen: element.imagen 
            };
            this.salasDisponibles.push(data);
          }
        });
    });

  }

//Funcion para obtener la fecha del sistema
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

}

interface sala {
  id: string;
  nombre: string;
  ocupada: string;
  imagen: string;
}