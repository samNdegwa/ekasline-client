import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string
  password: string

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  
  login(form: NgForm): void {
    const email: string = this.email
    const password: string = this.password
    if(email && password) {
    document.getElementById("btn-user-login").innerHTML="<i class='fa fa-spinner fa-pulse'></i> Please wait...";
    $('btn-user-login').prop('disabled', true);
    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginUser(email,password);
  }
} 

}
