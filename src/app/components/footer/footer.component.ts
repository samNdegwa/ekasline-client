import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PaymentsService } from 'src/app/services/payments.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  authState: boolean;

  constructor(private userService: UserService, private payservice: PaymentsService,private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

  // testPay(){
  //   this.payservice.orderPaymentStkOpen('254726159307',1,530);
    // this.http.get('https://ekastech.com/store_backend/api/mpesa/index.php?mpesa=true&phone=254726159307&amount=1&id=565').subscribe(data =>{
    //   console.log(data);
    // })
  //}

}
