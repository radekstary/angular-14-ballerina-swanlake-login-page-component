import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(AUTH_API + 'users', httpOptions);
  }

  login(email: string, password: string): Observable<any> {
    
    return this.http.post(
      AUTH_API + 'auth/login',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'users', {
      email,
      password
    }, httpOptions);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'users/resetPassword', {
      email
    }, httpOptions);
  }
}
