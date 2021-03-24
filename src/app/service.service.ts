import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonInput } from './model/jsonInput';
import { Property } from './property/Property';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public DELETE_API:any=Property.DELETE_API;
  public API:any=Property.API;
  public GET_DETAILS_API:any=Property.GET_DETAILS_API;

  // public DELETE_API='http://ec2-18-221-1-103.us-east-2.compute.amazonaws.com:9092/apis/deleteAllData';
  // public API='http://ec2-18-221-1-103.us-east-2.compute.amazonaws.com:9092/apis/saveDetails';
  // public GET_DETAILS_API='http://ec2-18-221-1-103.us-east-2.compute.amazonaws.com:9092/apis/getAllResult';
  
  //  public DELETE_API='http://localhost:9092/apis/deleteAllData';
  //  public API='http://localhost:9092/apis/saveDetails';
  //  public GET_DETAILS_API='http://localhost:9092/apis/getAllResult';
  
  constructor(private httpClient :HttpClient) { 
  }
  // saveContributertDetails(dataset:JsonInput ):Observable<any>{
    //return this.httpClient.post(this.API,dataset.jsonData,{'headers':{ 'content-type': 'application/json'}} );
  //}

  saveContributertDetails(dataset:object[]):Observable<any>{
    return this.httpClient.post(this.API,dataset,{responseType: 'text'} );
  }

  getAllDataSet( visitId:string):Observable<any>{  
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { visitId:visitId}
  };
    
    return this.httpClient.get(this.GET_DETAILS_API,httpOptions);   
  }

  deleteAllDataSet():Observable<any>{     
    return this.httpClient.delete(this.DELETE_API);   
  }


}
