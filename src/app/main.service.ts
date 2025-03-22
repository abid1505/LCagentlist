import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  origin = environment.origin
  domain = environment.domain

  constructor(private http: HttpClient) { }
  getTypeWiseData(WLID, TYPE) {
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getAgentList/${WLID}/${TYPE}`);
  }
  getAllData(WLID) {
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getAgentList/${WLID}`);
  }
  getproxydata(WLID){
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getproxyLink/${WLID}`);
  
  }
  getmasterdata(WLID){
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getAgentList/${WLID}/6`);
  }
  getquicketagent(WLID){
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getAgentList/${WLID}/11`);
  }
  getParent(USERID: string) {
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getparent?USERID=${USERID}`);
  }
  getlanguage(language) {
    return this.http.get(`/assets/language/${language}.json`);
  }
  getWLID() {
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getWLID/${this.origin}`);
  }
  getupdate(){
    return this.http.get(`https://api3.vrnlapi.live:3479/api/GetLatestUpdate/${this.domain}`)
  }
  socialLink() {
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getSocialLink`)
}
}
