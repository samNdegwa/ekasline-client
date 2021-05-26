import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { ResponseModel, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.scss']
})
export class UserPaymentsComponent implements OnInit {

  userId;
  userPayments;
  myUser: any;
  details;

  constructor(private route: ActivatedRoute, private orderService: OrderService, 
    private payService: PaymentsService,private userService: UserService) { 
    this.route.params.subscribe(data => {
      this.userId = data.userId;
    });
  }

  ngOnInit(): void {
    this.payService.getUserPayments(this.userId).subscribe(datas => {
      this.userPayments = datas;
      this.userPayments = this.userPayments.payments;
      console.log(this.userPayments)
    });

    this.userService.userData$
    .subscribe((data: ResponseModel): void => {
      this.myUser = data;
      this.userService.getUserDetails(data.email).subscribe(datas => {
        this.details = datas;
      });
      
    });
  }

}
