import { Component } from '@angular/core';
import { ServicioService } from '../service/servicio.service';
import { DataModule } from '../module/data.module';
import { UsuariosModule } from '../module/usuarios.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  datos:any[] = [];
  constructor(public _servicioService:ServicioService) {}

  obntenerData(){
    this._servicioService.getApi().subscribe((resp:DataModule)=>{
      resp.usuarios.forEach((elem:UsuariosModule)=>{
        this.datos.push(`latitud: ${elem.lat}, longitud: ${elem.long}`)
      })
    });
  }
}
