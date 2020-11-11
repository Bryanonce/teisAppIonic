//Components
import { Component } from '@angular/core';
import { EntragaModule } from '../../module/entrega.module';
import { environment } from '../../../environments/environment';
//Servicios
import { GeolocalService } from '../../service/geolocal.service';
import { ServicioService } from '../../service/servicio.service';
//Modulos
import { MetodoPost } from '../../module/post.module';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public ultimaMedicion:EntragaModule = new EntragaModule();
  public medicionesMax:Number = 10;
  public contador:number = 0;
  public inicio:Boolean;
  constructor(public _geolocation:GeolocalService,
              public _servicioService:ServicioService
    ) {}

  validacionServicio(){
    if(this.inicio==true){
      this.inicio = false;
    }else{
      this.inicio = true;
      this.buclePost()
    }
  }

  buclePost(){

    var intervalos = setInterval(()=>{
      this.contador++;
      console.log(this.contador);
      if(this.contador<this.medicionesMax && this.inicio==true){
        return new Promise((resolve,reject)=>{
          try{
            this._geolocation.suscribirPost()
            .then((response:MetodoPost)=>{
              this._servicioService.postDatosJson(environment.Apirest,response)
              .subscribe((resp:EntragaModule)=>{
                resolve(resp);
              })
            })
          }catch(e){ 
            console.log(e)
          }
          setTimeout(()=>{
            reject("Tiempo de espera exedido")
          },5000)
        }).then((resp:EntragaModule)=>{
          this.ultimaMedicion = resp;
          console.log(this.ultimaMedicion);
        }).catch((err)=>{
          console.warn(err);
        })
      }else{
        clearInterval(intervalos);
        this.inicio = false;
      }
    },10000)
  }
} 