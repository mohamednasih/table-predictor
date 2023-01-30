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
    this.communicationService.subjectTable.next(this.selectedLeague.table.sort((teamA,teamB)=>{
      if(teamA.pts>teamB.pts){
        return -1
      }
      if(teamA.pts<teamB.pts){
        return 1;
      }
      return 0
    }));
  }
  getLeague(name: string): Observable<Team[]> {
    if (!!name) {
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
    }else{
      return of([])
    }
  }
  getFixtures(): Observable<Fixture[]> {
    return this.communicationService.fixturesObservable;
  }
  getFixuresToPredict(): Fixture[] {
    var i = 0;
    var fixtures: Fixture[] = [];
    this.selectedLeague.fixtures.every((fixture) => {
      var fixtureNotPredictedYet: boolean = fixture.fixtureState == null;
      var fixtureOfTeamToPredict: boolean =
        this.toBePredicted(fixture.home) || this.toBePredicted(fixture.away);
      if (fixtureNotPredictedYet && fixtureOfTeamToPredict) {
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
    }
  }
  teamLost(name: string) {
    var team = this.selectedLeague.table.find((team) => team.name == name);
    if (team != null) {
      team.lost = team.lost + 1;
      team.played = team.played! + 1;
    }
  }
  teamDraw(name: string) {
    var i = this.selectedLeague.table.findIndex((team) => team.name == name);
    var team = this.selectedLeague.table[i];

    if (team != null) {
      team.draw = team.draw + 1;
      team.pts = team.pts + 1;
      team.played = team.played! + 1;
    }
  }
  predict(fixtureToPrecict: Fixture, prediction: string) {
    let fi = this.selectedLeague.fixtures.find(
      (f) => f.home == fixtureToPrecict.home && f.away == fixtureToPrecict.away
    );
    if(!!fi){
      fi!.fixtureState = prediction;
      switch(prediction){
        case(fi.home):{
          this.teamWon(fi.home);this.teamLost(fi.away);break;
        }
        case(fi.away):{
          this.teamLost(fi.home);this.teamWon(fi.away);break;
        }
        case(fi.away):{
          this.teamDraw(fi.home);this.teamDraw(fi.away);break;
        }
      }
    this.sendTable()
    this.sendFixturesToPredict();
    }

  }


  toBePredicted(name: string): boolean {
    return this.teamsToPredict.get(this.selectedLeague.id)!.indexOf(name) != -1;
  }

  getProgress() {
    var numberOfPredictions = this.selectedLeague.fixtures.filter(
      (fi: Fixture) =>
        fi.fixtureState != null &&
        (this.toBePredicted(fi.away) || this.toBePredicted(fi.away))
    ).length;
    var numberofFixtures = this.selectedLeague.fixtures.filter(
      (fi: Fixture) =>
        this.toBePredicted(fi.away) || this.toBePredicted(fi.away)
    ).length;
    console.log("progress",(numberOfPredictions / numberofFixtures) * 100)
    return (numberOfPredictions / numberofFixtures) * 100;
  }
  removeTeamsFromPrediction(names: string[]) {
    names.forEach((name) => {
      if (this.toBePredicted(name)) {
        var index = this.teamsToPredict
          .get(this.selectedLeague.id)!
          .indexOf(name);
        this.teamsToPredict.get(this.selectedLeague.id)!.splice(index, 1);
      }
    });
    this.sendFixturesToPredict();
  }
  onlyTop4(){
    var nonTop4Teams=this.selectedLeague.table.filter((f,index)=>index>4-1).map(t=>t.name);
    var top4Teams=this.selectedLeague.table.filter((f,index)=>index<4).map(t=>t.name)
    this.removeTeamsFromPrediction(nonTop4Teams)
    this.addTeamsToPrediction(top4Teams)


  }
  onlyBottom4() {
    var bottom4Teams=this.selectedLeague.table.filter((f,index)=>index>=this.selectedLeague.table.length-4).map(t=>t.name);
    var nonBottom4Teams=this.selectedLeague.table.filter((f,index)=>index<this.selectedLeague.table.length-4).map(t=>t.name)
    this.removeTeamsFromPrediction(nonBottom4Teams)
    this.addTeamsToPrediction(bottom4Teams)
  }

  addTeamsToPrediction(names: string[]) {
    names.forEach((name) => {
      if (!this.toBePredicted(name)) {
        this.teamsToPredict.get(this.selectedLeague.id)!.push(name);
      }
    });
    console.log(names, this.teamsToPredict.get(this.selectedLeague.id));
    this.sendFixturesToPredict();
  }
}
