import { Component } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
import { ServicioService } from '../service/servicio.service';
import { environment } from '../../environments/environment';
import { MetodoPost } from '../module/post.module';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public medicionesMax:Number = 10;
  public contador:number = 0;
  public inicio:Boolean;
  public form:MetodoPost;
  public mat:number = 201500441;
  public logs:any = [];
  public lat:number  = 0;
  public long:number = 0;
  constructor(public geolocation:Geolocation,
              public _servicioService:ServicioService
    ) {
    this.getGeo()
  }

  getGeo():number[]{
    this.geolocation.getCurrentPosition()
      .then((geoposition:Geoposition)=>{
        this.lat = geoposition.coords.latitude;
        this.long = geoposition.coords.longitude;
      })
    return [this.lat,this.long]
  }

  suscribirPost(){
    let lat:Number = this.getGeo()[0];
    let long:Number = this.getGeo()[1];
    this.form = new MetodoPost(this.mat,lat,long);
    this._servicioService.postDatosJson(environment.Apirest,this.form).subscribe((resp)=>{
      console.log(resp);
    })
  }

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
          resolve(this.suscribirPost())
        }).then((resp)=>{
          console.log(resp)
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