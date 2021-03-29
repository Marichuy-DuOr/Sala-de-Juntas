import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MysqlService } from './../services/mysql.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  public salasOcupadas = [];
  public salasDisponibles = [];
  
  constructor(private router: Router, private mysqlService: MysqlService) { }

  reservar(item: any){
    this.router.navigate([ '/reservar', item ]);
  }

  ngOnInit(): void {
    this.actualizar();
  }

  public actualizar() {
    this.mysqlService
      .consulta(`${environment.API_URL}/salas`)
      .subscribe((res: any) => {
        console.log(res);

        res.array.forEach(element => {
          if(element.ocupada === 1 ){
            const data: sala = {
              id: element.id,
              nombre: element.nombre,
              ocupada: element.ocupada,
              imagen: element.imagen  
            };
            this.salasOcupadas.push(data);
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
  }

}

interface sala {
  id: string;
  nombre: string;
  ocupada: string;
  imagen: string;
}