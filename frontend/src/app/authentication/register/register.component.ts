//Se crea un nuevo usuario con los datos proporcionados
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { MysqlService } from './../../services/mysql.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  public newUserForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', Validators.required),
    contrasenaVerf: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private mysqlService: MysqlService, private router: Router) {
    this.newUserForm.setValue({
      nombre: '',
      apellido: '',
      correo: '',
      contrasena: '',
      contrasenaVerf: ''
    });
  }

  ngOnInit(): void {
    document.getElementById('uno').style.display = 'none';
    document.getElementById('dos').style.display = 'none';
    document.getElementById('tres').style.display = 'none';
  }

  public newUser(form) {
    if (this.newUserForm.valid) {
      const body = {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        contrasena: form.contrasena,
      };


      if (body.contrasena === form.contrasenaVerf) {
        this.authService.register(body).then((data) => {
          if (!data['success']) {
            document.getElementById('tres').style.display = 'block';
            setTimeout(() => document.getElementById('tres').style.display = 'none', 5000);
          } else {
          let id_usuario = data['array'].insertId;
          this.router.navigate(['/login']);
          
        
          }
        })
        .catch((err) => {
          console.log(err);
        });

      } else {
        document.getElementById('dos').style.display = 'block';
        setTimeout(() => document.getElementById('dos').style.display = 'none', 5000);
      }
    } else {
      document.getElementById('uno').style.display = 'block';
      setTimeout(() => document.getElementById('uno').style.display = 'none', 5000);
    }

  }

  cerrar(alerta: string) {
    document.getElementById(alerta).style.display = 'none';
  }

}
