import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user-service/user.service';

@Component({
  selector: 'ef-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.css']
})
export class UserBadgeComponent implements OnInit {

  user: User;

  constructor(private userService: UserService) { 
    this.user = userService.getLoggedInUser();
  }

  ngOnInit(): void {
  }

}
