import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Fixture } from '../models/fixture';
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
  private selectedLeague!:League;
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
          this.selectedLeague=league;
          this.communicationService.subjectTable.next(league.table)
          this.sendFixturesToPredict()
    }else{
      var getLeagueByName= this.getDataService.getLeague(name);
      getLeagueByName.subscribe((league)=>{
        this.leagues.push(league);
        this.selectedLeague=league
        this.communicationService.subjectTable.next(league.table)
        this.sendFixturesToPredict()
      })
      
    }
    return this.communicationService.tableObservaleTable
   }
  getFixtures():Observable<Fixture[]> {
    return this.communicationService.fixturesObservable;
  }
  getFixuresToPredict():Fixture[]{
    var i=0;
    var fixtures:Fixture[]=[]
    this.selectedLeague.fixtures.every((fixture)=>{
      if(fixture.fixtureState==null){
        console.log("push",fixture)
        fixtures.push(fixture);
      }
      if(i==7){
        return false
      }else{
        i++;
        return true;
      }
    })
    return fixtures;
  }
  sendFixturesToPredict(){
    this.communicationService.subjectFixtures.next(this.getFixuresToPredict())
  }
  getImage(name:string){
      console.log(name)
      var team=this.selectedLeague.table.find((team)=>team.name==name)
      console.log(team)
      if(team!=undefined){
        console.log(team.image)
        return team.image
      }else{
        throw("errror")
      }
      
      
   
   
  }
}
