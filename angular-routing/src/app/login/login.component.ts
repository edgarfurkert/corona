import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  login(userName: string, password: string) {
    const result = this.loginService.login(userName, password);
    if (result) {
      const queryParams = this.route.snapshot.queryParams;
      const redirect = queryParams['redirect'] || '/';
      this.router.navigateByUrl(decodeURI(redirect));
    }
  }

}
