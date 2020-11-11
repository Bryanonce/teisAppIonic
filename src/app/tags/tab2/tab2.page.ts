//Componentes
import { Component } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';


//Modulos
import { Consulta } from '../../module/consulta.module';
import { DataModule } from '../../module/data.module';
import { MetodoPost } from '../../module/post.module';

//Servicios
import { ServicioService } from '../../service/servicio.service';
import { GeolocalService } from '../../service/geolocal.service';

//Enviroments
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private consulta:Consulta = new Consulta()
  public contador:Number;
  public datos = [];
  public rojo = false;
  public amarillo = false;
  public azul = false;
  constructor(public _servicioService:ServicioService,
              public _geoLocalService:GeolocalService
    ) {}

  obntenerData(){
    return this._servicioService.getDatosJson(environment.Apirest,this.consulta)
  }

  obtenerPeligro(){

    //Cálculo de zona actual
    this._geoLocalService.suscribirPost()
    .then((respuesta:MetodoPost) =>{
        //Llamar a la base de datos
        console.log(respuesta);
        this.datos = [];
        this.obntenerData().subscribe((resp:DataModule)=>{
          resp.usuarios.forEach((elementos)=>{
            let distancia:Number = Math.sqrt(Math.pow(Number(respuesta.lat)-Number(elementos.lat),2)+Math.pow(Number(respuesta.long)-Number(elementos.long),2));
            console.log(distancia)
            if(Number(distancia)<20){
              this.contador = Number(this.contador)+1
            }
          })
          //console.log(this.contador);
          if(this.contador>10){
            this.rojo = true;
            this.amarillo =false;
            this.azul = false;
          }else if(this.contador>5){
            this.rojo = false;
            this.amarillo =true;
            this.azul = false;
          }else{
            this.rojo = false;
            this.amarillo =false;
            this.azul = true;
          }
        })
    })
    

    
    
  }

}
