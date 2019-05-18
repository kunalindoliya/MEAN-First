import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthModel} from './auth.model';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  private token;
  private isAuthenticated = false;
  // @ts-ignore
  private tokenTime: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthModel = {email, password};
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(result => {
        this.router.navigate(['/']);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthModel = {email, password};
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(result => {
        this.token = result.token;
        if (this.token) {
          const expiresIn = result.expiresIn;
          this.setAuthTime(expiresIn);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
          );
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const userInformation = this.getAuthData();
    if (!userInformation) {
      return;
    }
    const expiresIn = userInformation.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = userInformation.token;
      this.isAuthenticated = true;
      this.setAuthTime(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTime(duration: number) {
    this.tokenTime = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTime);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {token, expirationDate: new Date(expirationDate)};
  }
}
