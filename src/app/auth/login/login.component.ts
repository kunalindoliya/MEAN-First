import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authSubs: Subscription;

  constructor(private authService: AuthService) {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.authSubs = this.authService.getAuthStatusListener().subscribe(result=>{
      this.isLoading = false;
    })
  }
}
