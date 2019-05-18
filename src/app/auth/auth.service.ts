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
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe((result) => {
        this.router.navigate(['/']);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthModel = {email, password};
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((result) => {
        this.token = result.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
