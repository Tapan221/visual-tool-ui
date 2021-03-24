import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { JsonInput } from '../model/jsonInput';
import { SummaryResult } from '../model/SummaryResult';
import { ApiService } from '../service.service';
import { ChartOptions, ChartDataSets, ChartType, } from 'chart.js';
import { Chart } from 'node_modules/chart.js'
import * as moment from 'moment';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('mixPlot') canvasRef: ElementRef;
  errorMessage: string = "hide";
  successMessage: string = "hide";
  element: any;
  jsonData: object;
  inputJsonDataArray: object[] = [];
  fileData: any;
  certEscolar: any;
  selectedFiles: File[] = [];
  allResultSet: SummaryResult[];
  visitId: string = "10";
  myModel = "10";
  public recommDose = [];
  scatterChartObject: any;

  //scatter chart co-ordinates
  xcoordinates = [];
  ycoordinates = [];
  xcoordinatesFittedFpg = [];
  ycoordinatesFittedFpg = [];
  coords = [];
  coordFittedFpg = [];
  barChartCoordinates = [];
  calculateDaysBasedOnDates = [];
  xcodRawFbgSorted = [];
  barChartInstance: any;
  mixChartInstance: any;
  mixExampleInstance:any;
  resultArray1 = [];
  resultArray2 = [];
  resultArray3 = [];
  maxVisiId:number=20;







  constructor(private apiService: ApiService) {

  }

  ngOnInit() {

  }




  //Draw Scatter with line Chart mixed Plot
  drawMixedPlot(coOrdinatesRaw, coOrdinatesRawFittedFpg, rawFpgXcoordSorted) {
    const canvas = <HTMLCanvasElement>document.getElementById('mixPlot');
    var ctx = canvas.getContext('2d');
    this.mixChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        //labels: rawFpgXcoordSorted,
        labels: this.resultArray3,
        datasets: [
          {
            type: "scatter",
            data: coOrdinatesRaw,
            label: 'Glucose (mg/dL)',
            pointRadius: 5,
            pointBackgroundColor: 'blue',
            backgroundColor: "blue",
            borderColor: 'blue'
          },
          {
            type: "line",
            label: "Glucose (mg/dL)",
            data: coOrdinatesRawFittedFpg,
            backgroundColor: "black",
            borderColor: "black",
            fill: false,
            lineTension: 0,
            pointRadius: 1
          },
          {
            type: "bar",
            label: "Recommended Dose (mg)",
            barThickness: 5,
            data: this.barChartCoordinates,
            backgroundColor: 'green',
            borderColor: 'green'
          }


        ]
      },
      options: {
        title: {
          display: true,
          text: 'Scatter Chart (Raw FBG Information) Line Chart (Fitted FBG Information)'
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            barThickness: 20,  // number (pixels) or 'flex'
            maxBarThickness: 22,
            ticks: {
              userCallback: function (tick) {
                //return tick.toString() + 'Hz';
                return tick.toString();

              },
            },
            scaleLabel: {
              labelString: 'days',
              display: true,
            }
          }],
          yAxes: [{
            type: 'linear',
            barThickness: 20,  // number (pixels) or 'flex'
            maxBarThickness: 22,
            ticks: {
              userCallback: function (tick) {
                //return tick.toString() + 'dB';
                return tick.toString();
              }
            },
            scaleLabel: {
              labelString: 'Glucose (mg/dL)',
              display: true
            }
          }]
        }
      },
    });
  }

  //https://stackoverflow.com/questions/55079298/chartjs-add-dots-to-bars-in-grouped-bar-chart

  //this.drawMixedPlot(this.coords, this.coordFittedFpg, this.xcodRawFbgSorted);
  //this.drawBarChartPlot(this.resultArray3, this.barChartCoordinates);
  mixPlotExample() {
    var data = {
      labels: this.resultArray3,
      datasets: [
        // {
        //   type: "bar",
        //   label: "Cookies",
        //   data: this.barChartCoordinates,
        //   stack: 'Stack 1',
        //   backgroundColor: 'green',
        //   borderColor: 'green',

        //   barThickness: 5,
        // },

        {
          label: 'Glucose (mg/dL)',
          type: "scatter",
          fill: false,
          showLine: false,
          data: this.coords,
          pointBackgroundColor: 'blue',
          backgroundColor: "blue",
          borderColor: 'blue'
        },
        {
          label: "Glucose (mg/dL)",
          type: "line",
          fill: false,
          backgroundColor: "black",
          borderColor: "black",
          lineTension: 0,
          pointRadius: 1,
          data: this.coordFittedFpg,

        }

      ]
    };

    this.mixExampleInstance= new Chart("mixExample", {
      type: 'bar',
      data: data,
      options: {
        title: {
          display: true,
          text: 'Scatter Chart (Raw FBG Information) Line Chart (Fitted FBG Information)'
        },
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              labelString: 'days',
              display: true,
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            stacked: true,
            scaleLabel: {
              labelString: 'Glucose (mg/dL)',
              display: true,
            }
          }]
        }
      }
    });
  }


  drawBarChartPlot(recommDose, xcodRawFbgSorted) {
    const canvas = <HTMLCanvasElement>document.getElementById('barChart');


    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 100, 100);

    this.barChartInstance = new Chart(ctx, {
      type: "bar",
      data: {

        labels: this.resultArray3,
        datasets: [{
          //barPercentage: 0.5,
          label: "Recommended Dose (mg)",
          barThickness: 5,
          data: this.barChartCoordinates,
          backgroundColor: 'green',
          borderColor: 'green'

        }]
      },
      options: {
        intersect: true,
        mode: 'x',
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return "No of days past: " + tooltipItem.xLabel + " , Recommended Dose: " + tooltipItem.yLabel;
            },
          }
        },
        responsive: true,
        title: {
          display: true,
          text: 'Bar Chart (Recommended Dose Vs Date)'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'days',
              display: true,
            }
          }],
          yAxes: [{

            scaleLabel: {
              labelString: 'BIF (mg)',
              display: true,
            }


          }]
        }

      },
    });

  }





  checkSuccessResponse() {
    if (this.successMessage === "hide") {
      return false;
    }
    else {
      return true;
    }
  }

  checkFailureResponse() {
    if (this.errorMessage === "hide") {
      return false;
    }
    else {
      return true;
    }
  }

  public onFileChanged(event: any) {
    var len = event.target.files.length;
    for (let index = 0; index < len; index++) {
      //const element = array[index];


      var file: File = event.target.files[index];
      var myReader: FileReader = new FileReader();
      var fileType = event.target.parentElement.id;
      myReader.onloadend = (e) => {

        console.log(myReader.result);
        this.fileData = myReader.result;
        console.log("Hello read as text" + this.fileData);
        this.jsonData = this.fileData;
      };
    }
    event.target.value = '';
    //console.log( "Hello read as text"+myReader.readAsText(file));

  }


  fileAdded(event) {
    this.selectedFiles = [];
    this.inputJsonDataArray = [];
    this.successMessage = " ";
    if (typeof (this.barChartInstance) !== "undefined" && typeof (this.mixChartInstance) !== "undefined" && typeof (this.mixExampleInstance) !== "undefined") {
      this.barChartInstance.destroy();
      this.mixChartInstance.destroy();
      this.mixExampleInstance.destroy();
    }
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(<File>event.target.files[i]);
        console.log(this.selectedFiles[i].stream());
      }

    }

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.readFile(this.selectedFiles[i]);
    }


  }

  readFile(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      this.fileData = reader.result;
      this.jsonData = this.fileData;
      //this.onSubmitContributerDetails(this.jsonData);
      this.inputJsonDataArray.push(this.jsonData);
    };
    reader.readAsText(file);
    //this.onSubmitContributerDetails(this.inputJsonDataArray);
    // for (let index = 0; index < this.inputJsonDataArray.length; index++) {
    //this.onSubmitContributerDetails(this.inputJsonDataArray[index]);

    //}
  }



  deletePreviousDataSet() {

    this.jsonData = null;
    this.fileData = null;
    this.selectedFiles = [];
    this.inputJsonDataArray = [];
    this.allResultSet = [];
    this.recommDose = [];
    this.xcoordinates = [];
    this.ycoordinates = [];
    this.xcoordinatesFittedFpg = [];
    this.ycoordinatesFittedFpg = [];
    this.coords = [];
    this.coordFittedFpg = [];
    this.recommDose = [];
    this.xcodRawFbgSorted = [];
    this.barChartInstance.destroy();
    this.mixChartInstance.destroy();
    this.mixExampleInstance.destroy();
    this.apiService.deleteAllDataSet().subscribe(

      (data) => {
        console.log("DB Cleaned up");
        this.successMessage = "";
      },
      error => {
        console.log("Error Occoured" + error);
        this.errorMessage = "";
      }
    );
  }


  async saveDetailData(dataSet) {
    const data = await this.apiService.saveContributertDetails(dataSet).toPromise().then(
      (data) => {
        console.log(JSON.stringify(data));
        //this.successMessage = data;
        this.maxVisiId=data;
        this.errorMessage = "";
        this.onSubmitDetails();
      },
      error => {
        console.log("Error Occoured" + error);
        this.errorMessage = error;
        this.successMessage = " ";

        this.onSubmitDetails();
      }


    );

  }





  saveDetails() {
    this.saveDetailData(this.inputJsonDataArray);

  }

  onSubmitDetails() {
    //this.onSubmitContributerDetails(this.inputJsonDataArray);
    this.apiService.getAllDataSet(this.myModel).subscribe(

      (data) => {
        console.log(data);
        this.allResultSet = [];
        this.allResultSet = data;
        this.recommDose = [];
        this.xcoordinates = [];
        this.ycoordinates = [];
        this.xcoordinatesFittedFpg = [];
        this.ycoordinatesFittedFpg = [];
        this.coords = [];
        this.coordFittedFpg = [];
        this.calculateDaysBasedOnDates = [];
        this.resultArray1 = [];
        this.resultArray2 = [];
        this.resultArray3 = [];

        //This is to display the bar chart
        for (let index = 0; index < this.allResultSet.length; index++) {
          //this.barChartLabels.push(this.allResultSet[index].datetime);
          this.recommDose.push(this.allResultSet[index].recommendedDose);

          console.log(this.allResultSet[index].datetime);
          console.log(this.allResultSet[index].v2);

          var a = moment(this.allResultSet[index].datetime);
          var b = moment(this.allResultSet[index].v2);
          if (a != null && b != null)
            this.calculateDaysBasedOnDates.push(Math.abs(a.diff(b, 'days')));
          //this is to display Scatter Plot:
          //Concat Array
          //this.xcoordinates=this.xcoordinates.concat(this.allResultSet[index].xcoordinates);
          //this.ycoordinates=this.ycoordinates.concat(this.allResultSet[index].ycoordinates);        
        }


        //This is to get the last result set based on the dragable  pointer
        if (this.allResultSet[this.allResultSet.length - 1] != null) {
          this.xcoordinates = this.allResultSet[this.allResultSet.length - 1].xcoordinates;
          this.ycoordinates = this.allResultSet[this.allResultSet.length - 1].ycoordinates;
          this.xcoordinatesFittedFpg = this.allResultSet[this.allResultSet.length - 1].xcoordinatesFittedFpg;
          this.ycoordinatesFittedFpg = this.allResultSet[this.allResultSet.length - 1].ycoordinatesFittedFpg;
        }

        //This code is to show the x axis and y axis co-ordinates in bar chart
        if (this.calculateDaysBasedOnDates.length > 0) {
          let hight_day = this.calculateDaysBasedOnDates[this.calculateDaysBasedOnDates.length - 1];

          for (let index = 0, i = 0; index <= hight_day && i < this.calculateDaysBasedOnDates.length; index++) {
            if (Number(index) === Number(this.calculateDaysBasedOnDates[i])) {
              this.resultArray1.push(this.calculateDaysBasedOnDates[i]);
              i++;
            }
            else {
              this.resultArray1.push(0);
            }
            this.resultArray3.push(index);
          }
          //resultArray1 has been used to determine resultArray2
          for (let index = 0, i = 0; index < this.resultArray1.length && i < this.recommDose.length; index++) {
            if (Number(this.resultArray1[index]) === 0) {
              this.resultArray2.push(0);
            }
            else {
              this.resultArray2.push(this.recommDose[i]);
              i++;
            }

          }
        }

        console.log(this.resultArray1);
        console.log(this.resultArray2);
        console.log(this.resultArray3);


        this.coords = this.xcoordinates.map((v, i) => ({ x: v, y: this.ycoordinates[i] }));
        this.coords.sort(function (a, b) { return a.x - b.x; })

        this.coordFittedFpg = this.xcoordinatesFittedFpg.map((v, i) => ({ x: v, y: this.ycoordinatesFittedFpg[i] }));
        this.coordFittedFpg.sort(function (a, b) { return a.x - b.x; })

        //this.barChartCoordinates = this.calculateDaysBasedOnDates.map((v, i) => ({ x: v, y: this.recommDose[i] }));
        //this.barChartCoordinates.sort(function (a, b) { return a.x - b.x; })

        this.barChartCoordinates = this.resultArray3.map((v, i) => ({ x: v, y: this.resultArray2[i] }));



        this.xcodRawFbgSorted = this.xcoordinates.sort(function (a, b) { return a - b; })


        console.log(this.xcoordinates);
        console.log(this.xcodRawFbgSorted);
        console.log(this.coords);
        console.log(this.xcoordinatesFittedFpg);
        console.log(this.ycoordinatesFittedFpg);
        console.log(this.calculateDaysBasedOnDates);
        this.drawMixedPlot(this.coords, this.coordFittedFpg, this.xcodRawFbgSorted);
        this.drawBarChartPlot(this.resultArray3, this.barChartCoordinates);
        this.mixPlotExample();
        this.successMessage = "Data Retrieved Successfully ";





      },
      error => {
        console.log("Error Occoured" + error);
        this.errorMessage = "Invalid JSON Schema";
        this.successMessage = "";

      }
    );
  }

  // selectVisitId(value: string) {
  //console.log(value);
  //this.visitId = value;
  //return value;
  //}
  update(event) {
    //https://stackoverflow.com/questions/46455163/how-to-destroy-previous-chart-canvas-after-new-one-is-shown-angular-4
    
    this.mixChartInstance.destroy();
    this.mixExampleInstance.destroy();
    this.barChartInstance.destroy();
    console.log(event.value);
    this.visitId = event.value;
    this.successMessage = " ";
    this.onSubmitDetails();


  }








}
