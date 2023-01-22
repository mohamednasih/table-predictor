import { Component, OnInit } from '@angular/core';
import { OnSameUrlNavigation } from '@angular/router';
import { League } from 'src/app/models/league';
import { Team } from 'src/app/models/team';
import { PredictService } from 'src/app/services/predict.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
    leagueNames!:string[];
    table!:Team[];
    constructor(private predictService:PredictService){

    }
  ngOnInit(): void {
    this.predictService
                      .getLeagues()
                      .subscribe((leagueNames)=>  
                                              {this.leagueNames=leagueNames;
                                              this.getLeagueByName(leagueNames[0])
                                              }
                                )
  }
  getLeagueByName(name:string){

    this.predictService.getLeague(name).subscribe((table)=>{
      this.table=table;
      console.log(this.table)
    })
  }
}
