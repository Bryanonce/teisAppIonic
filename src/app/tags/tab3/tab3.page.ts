import { Component } from '@angular/core';
import { ServicioService } from '../../service/servicio.service';
import * as mapboxgl from 'mapbox-gl';
import { Consulta } from '../../module/consulta.module';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public coorden = [];
  public consulta:Consulta;
  public anioIni:Number;
  constructor(public _servicioService:ServicioService) {
    this.consulta = new Consulta()
  }
  pruebaImprimir(){
	  console.log(this.consulta);
  }
  cargarMapa(){
    this.coorden = [];
    var map = new mapboxgl.Map({ 
      accessToken: environment.claveMapbox,
      container: 'mapa-mapbox', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-80.096961, -0.712307], // starting position
      zoom: 15 // starting zoom
    })
    this._servicioService.getDatosJson(environment.Apirest,this.consulta).subscribe((res:any)=>{
      res.usuarios.forEach((elemento)=>{
        this.coorden.push(
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [elemento.long,elemento.lat]
            }
          }
        );
      })
    });
    console.log("Mapa cargando .....")
    map.on('load',()=>{
      console.log(this.coorden);
      map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": this.coorden
        }
      });
      map.addLayer({
        id: 'trees-point',
        type: 'heatmap',
        source: 'earthquakes',
        paint: {
          'heatmap-color': ['interpolate',['linear'],['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
            ]
        }
      })
    })
  }

  ngOnInit(){	
	return this.cargarMapa();
  }


}
