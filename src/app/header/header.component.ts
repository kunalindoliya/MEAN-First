import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {
  }

  private authListenerSubs: Subscription;

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }


}
