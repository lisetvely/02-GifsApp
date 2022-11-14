import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../Interface/gifs.interface';

@Injectable({
  providedIn: 'root' //Con esto angular lo llevaré de manera global de la aplicación
})

export class GifsService {

  //https://developers.giphy.com/
  private apiKey    : string = '13XF1CJSTdaL9NOHJpgiXpb8qJMie7Ho';
  private servicioUrl    : string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultado: Gif[] = []; //Tiene los ultimos resultados

  get historial(){
    return [...this._historial];
  }

  constructor( private http: HttpClient ){

    // Con el ! se admite null
    // Con el || se dice que puede estar vacío
    this._historial = JSON.parse ( localStorage.getItem('historial')! ) || [];

    //Se lee el resultado guardardo en el localstorage
    this.resultado = JSON.parse ( localStorage.getItem('resultado')! ) || [];

    // if (localStorage.getItem( 'historial' )){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }

 buscarGifs( query: string = ''){

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes ( query) ){

      this._historial.unshift( query );
      this._historial = this._historial.splice (0,10);

      //grabar en el localstorage
      localStorage.setItem('historial', JSON.stringify ( this._historial ) );

    }

    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('q', query)
        .set('limit', '10'); 

    //console.log(this._historial);    
    //Observable: Tiene mayor control que la promesa
    // Se puede añadir funcionalidades a la hora de hacer la petición, contenar la respuesta, 
    // poder disparar otra petición simultaneamente. Propios de RJDS7
    //this.http.get <SearchGifsResponse>( `https://api.giphy.com/v1/gifs/search?api_key=13XF1CJSTdaL9NOHJpgiXpb8qJMie7Ho&q=${ query }&limit=10` )

    this.http.get <SearchGifsResponse>( `${ this.servicioUrl }/search`, { params } )
      .subscribe ( (resp ) => {

        this.resultado = resp.data;

        //Guardar en el localstorage el resultado
        localStorage.setItem('resultado', JSON.stringify ( this.resultado ) );

      });

  }

}
