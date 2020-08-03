import { Component, OnInit, Inject } from '@angular/core';
import { LoginService } from '../login.service';
import { RANDOM_VALUE } from '../app-tokens';

@Component({
  selector: 'ef-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  greeting: string;
  private loginService: LoginService;

  /*
  private loginService: LoginService;

  //1.) constructor(@Inject(LoginService) loginService: LoginService) { 
  //2.) @Inject ist nicht notwendig, wenn bereits ein anderer Decorator (hier: @Component) verwendet wurde.
  constructor(loginService: LoginService) { 
    this.loginService = loginService;
  }
  */
 // 3.) LoginService injizieren und Member-Variable anlegen
 //constructor(private loginService: LoginService, @Inject('greeting') greeting: string) { 
 // 4.) useExisting (siehe app.module.ts)
 constructor(@Inject('currentLoginService') loginService, 
             @Inject('greeting') greeting: string, 
             @Inject('random-value') random, 
             @Inject(RANDOM_VALUE) random2) { 
   this.loginService = loginService;
   this.greeting = greeting;
   console.log('Random1: ', random);
   console.log('Random1: ', random);
   console.log('Random2: ', random2);
   console.log('Random2: ', random2);
 }


  ngOnInit(): void {
  }

  submit() {
    this.loginService.login({username: 'chris', password: 's3cret'});
    console.log(this.greeting);

  }

}
