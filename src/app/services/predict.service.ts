import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { League } from '../models/league';
import { Team } from '../models/team';
import { CommunicationsService } from './communications.service';
import { GetDataService } from './get-data.service';

@Injectable({
  providedIn: 'root'
})
export class PredictService {
  private leagueIds!:string[];
  private leagues:League[]=[];
  constructor(private getDataService:GetDataService,private communicationService:CommunicationsService) {
      
   }
   getLeagues(){
    if(this.leagueIds==null){
      
      var leagueNames=this.getDataService.getLeagues()
      this.getDataService
                        .getLeagues()
                        .subscribe((leagueIds)=>{this.leagueIds=leagueIds})
      return leagueNames;
    }else{
      return of(this.leagueIds);
    }
    
    

   }
   getLeague(name:string):Observable<Team[]>{
    let league:League=this.leagues.find((league)=>league.id==name) as League
    if(league){
          return of(league.table);
    }else{
      var getLeagueByName= this.getDataService.getLeague(name);
      getLeagueByName.subscribe((league)=>{
        this.leagues.push(league);
        this.communicationService.subjectTable.next(league.table)
      })
      return this.communicationService.tableObservaleTable
    }
   }
}
