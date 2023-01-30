import { Component, OnInit ,ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { OnSameUrlNavigation } from '@angular/router';
import { League } from 'src/app/models/league';
import { Team } from 'src/app/models/team';
import { PredictService } from 'src/app/services/predict.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit,AfterContentChecked {

    constructor(public predictService:PredictService,    private changeDetector: ChangeDetectorRef,
      ){

    }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  ngOnInit(): void {

  }
  getLeagueByName(name:string){


  }
  onlyTOP4(){
    this.predictService.onlyTop4()

  }
  removeOrAddTeamToPrediction($event:any,name:string){
      console.log(name,$event)
      if(!$event.target.checked){
        this.predictService.removeTeamsFromPrediction([name])
      }else{
        this.predictService.addTeamsToPrediction([name])
      }
  }
  onlyBottom4(){
    this.predictService.onlyBottom4()


  }
}
