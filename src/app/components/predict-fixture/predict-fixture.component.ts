import { Component, OnInit } from '@angular/core';
import { Fixture } from 'src/app/models/fixture';
import { PredictService } from 'src/app/services/predict.service';

@Component({
  selector: 'app-predict-fixture',
  templateUrl: './predict-fixture.component.html',
  styleUrls: ['./predict-fixture.component.css']
})
export class PredictFixtureComponent implements OnInit{
  fixturesToPrecict!:Fixture[]
  constructor(public predictService:PredictService){

  }
  ngOnInit(): void {
    this.predictService.getFixtures().subscribe((fixturesToPrecict)=>{
      this.fixturesToPrecict=fixturesToPrecict;
    })
  }
  converFloatToInt(number:number){
    return parseInt(number+"")
  }
}
