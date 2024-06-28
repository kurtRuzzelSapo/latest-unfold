import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userData: any;

  constructor(private http: HttpClient) {}

  apiURL: string = 'http://localhost/unfold-backup/unfold-api/api/';
  // apiURL: string = 'https://unfoldap.online/unfold-api/api/';

  private generateQueryString(params: any): string {
    if (!params) return ''; // If no parameters, return an empty string
    return '?' + Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  }

  sendRequestWithMedia(endpoint: string, data: any): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, data);
  }

  // sendRequestWitoutMedia(endpoint: string, data: any, headers: any = null): Observable<Status> {
  //   return this.http.post<Status>(this.apiURL + endpoint, JSON.stringify(data), {headers});
  // }
  sendRequestWithoutMedia(endpoint: string, data: any, ): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, data);
  }

  getRequest(endpoint: string) {
    const result = this.http.get(this.apiURL + endpoint);
    return result;
  }

  getRequestWithParams(endpoint: string, params: any) {

    const url = this.apiURL + endpoint + this.generateQueryString(params);

    return this.http.get(url);
  }

  deleteRequest(endpoint: string, data: any): Observable<any> {
    // Construct query parameters from the data object
    let params = new HttpParams();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.append(key, data[key]);
      }
    }

    return this.http.delete<any>(`${this.apiURL}${endpoint}`, {
      params: params
    });

  }


deleteProject(projectId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-project/${projectId}`);
}

deleteAccomplishment(accomplishmentId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-accomplishment/${accomplishmentId}`);
}

deleteSkill(skillId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-skill/${skillId}`);
}
deleteContact(contId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-contact/${contId}`);
}

deleteService(serviceId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}delete-service/${serviceId}`);
}
addViews(studentID: any): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}add-views/${studentID}`);
}
Approved(studentID: any): Observable<any> {
  return this.http.delete<any>(`${this.apiURL}approved/${studentID}`);
}

  sendRequest(endpoint: string, data: any): Observable<Status> {
    return this.http.post<Status>(this.apiURL + endpoint, JSON.stringify(data));
  }
}
