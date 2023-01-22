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
  providedIn: 'root',
})
export class PredictService {
  private leagueIds!: string[];
  private leagues: League[] = [];
  private selectedLeague!: League;
  private teamsToPredict: Map<string, string[]> = new Map(); // name of the league, teams the user wants to predict

  constructor(
    private getDataService: GetDataService,
    private communicationService: CommunicationsService
  ) {}
  getLeagues() {
    if (this.leagueIds == null) {
      var leagueNames = this.getDataService.getLeagues();
      this.getDataService.getLeagues().subscribe((leagueIds) => {
        this.leagueIds = leagueIds;
      });
      return leagueNames;
    } else {
      return of(this.leagueIds);
    }
  }
  sendTable() {
    this.communicationService.subjectTable.next(this.selectedLeague.table);
  }
  getLeague(name: string): Observable<Team[]> {
    let league: League = this.leagues.find(
      (league) => league.id == name
    ) as League;
    if (league) {
      this.selectedLeague = league;
      this.sendTable();
      this.sendFixturesToPredict();
    } else {
      var getLeagueByName = this.getDataService.getLeague(name);
      getLeagueByName.subscribe((league) => {
        this.leagues.push(league);
        this.teamsToPredict.set(
          league.id,
          league.table.map((team) => team.name)
        );
        this.selectedLeague = league;
        this.sendTable();
        this.sendFixturesToPredict();
      });
    }
    return this.communicationService.tableObservaleTable;
  }
  getFixtures(): Observable<Fixture[]> {
    return this.communicationService.fixturesObservable;
  }
  getFixuresToPredict(): Fixture[] {
    var i = 0;
    var fixtures: Fixture[] = [];
    this.selectedLeague.fixtures.every((fixture) => {
      var fixtureNotPredictedYet:boolean=fixture.fixtureState == null
      var fixtureOfTeamToPredict:boolean=this.toBePredicted(fixture.home) || this.toBePredicted(fixture.away)
      if (fixtureNotPredictedYet  && fixtureOfTeamToPredict ) {
        console.log('push ' + i);
        fixtures.push(fixture);
      }
      if (fixtures.length == 9) {
        return false;
      } else {
        i++;
        return true;
      }
    });
    return fixtures;
  }
  sendFixturesToPredict() {
    this.communicationService.subjectFixtures.next(this.getFixuresToPredict());
  }
  getImage(name: string) {
    var team = this.selectedLeague.table.find((team) => team.name == name);
    if (team != undefined) {
      return team.image;
    } else {
      throw 'errror';
    }
  }

  teamWon(name: string) {
    var team = this.selectedLeague.table.find((team) => team.name == name);
    if (team != null) {
      team.pts = team.pts + 3;
      team.won = team.won + 1;
      team.played = team.played! + 1;
      this.sendTable();
    }
  }
  teamLost(name: string) {
    var team = this.selectedLeague.table.find((team) => team.name == name);
    if (team != null) {
      team.lost = team.lost + 1;
      team.played = team.played! + 1;
      this.sendTable();
    }
  }
  teamDraw(name: string) {
    var i = this.selectedLeague.table.findIndex((team) => team.name == name);
    var team = this.selectedLeague.table[i];

    if (team != null) {
      team.draw = team.draw + 1;
      team.pts = team.pts + 1;
      team.played = team.played! + 1;
      this.sendTable();
    }
  }
  predict(fixtureToPrecict: Fixture, prediction: string) {
    let fi = this.selectedLeague.fixtures.find(
      (f) => f.home == fixtureToPrecict.home && f.away == fixtureToPrecict.away
    );
    fi!.fixtureState = prediction;

    this.sendFixturesToPredict();
  }

  removeOrAddTeamToPrediction(names: string[]) {
    
    names.forEach((name)=>{
      if (!this.toBePredicted(name)) {
        this.teamsToPredict.get(this.selectedLeague.id)!.push(name);
      } else {
        var index = this.teamsToPredict.get(this.selectedLeague.id)!.indexOf(name);
        this.teamsToPredict.get(this.selectedLeague.id)!.splice(index, 1);
      }
    })
    
    this.sendFixturesToPredict()
   
  }
  toBePredicted(name:string):boolean{
    
     return this.teamsToPredict.get(this.selectedLeague.id)!.indexOf(name)!=-1;
  }
}
