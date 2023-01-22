import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { League } from '../models/league';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  leagues:string[]=["PL","LA LIGA"];// leagues fetching ids
  host:string="http://localhost:3000/"
  constructor(private httpClient:HttpClient) { }
  getLeagues():Observable<string[]>{
    return of(this.leagues);
  }
  getLeague(name:string):Observable<League>{
    return this.httpClient.get<League>(this.host+"league/"+name)
  }
}
