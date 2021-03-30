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

  public salasOcupadas = [];
  public salasDisponibles = [];
  public reservacion = [];
  hour:any;
  minute:any;
  public fecha;
  public ho;
  
  constructor(private router: Router, private mysqlService: MysqlService, private datePipe: DatePipe) { }

  verInformacion(item: any){
    this.router.navigate([ '/sala', item ]);
  }

  ngOnInit(): void {
    this.actualizar();
  }

  public actualizar() {
    this.mysqlService.consulta(`${environment.API_URL}/salas`)
      .subscribe((res: any) => {
        console.log(res);

        res.array.forEach(element => {
          if(element.ocupada === 1 ){

            this.mysqlService.consultaId(`${environment.API_URL}/verReservaciones/${element.id}` )
            .subscribe((res: any) => {
              console.log(res.id[0]);
                this.crearFecha();
                let h = res.id[0].fin_reunion;
                
                let myMoment = moment(h).format('YYYY-MM-DD hh:mm:ss');
                let myHora =  moment(myMoment).format('hh');
                let myMinute = moment(myMoment).format('mm');

                let horaBD = (Number(myHora)+12) +":" +Number(myMinute);
                
                if(horaBD <= (this.hour+":"+this.minute)){
                  let dato = {
                    id: element.id,
                    nombre: element.nombre,
                    ocupada: 0,
                    imagen: element.imagen
                  };
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
                  const data: sala = {
                    id: element.id,
                    nombre: element.nombre,
                    ocupada: element.ocupada,
                    imagen: element.imagen  
                  };
                  this.salasOcupadas.push(data);
                }
            });
          } else{
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

    this.salasOcupadas.forEach(data => {
      console.log(data);
      
    });

  }


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