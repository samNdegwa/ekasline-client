import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  message: string;
  orderId: number;
  products: ProductResponseModel[] = [];
  cartTotal: number;
  productsOrders;
  viewOrders;
  myDate;
  email: string;
  details;
  phone;
  name;
  userId;
  serverURL2 = environment.SERVER_URL2;

  constructor(private userService: UserService, private router: Router,
    private activeRote: ActivatedRoute, private payService: PaymentsService) { 
    this.activeRote.params.subscribe(od => {
      this.orderId = od.orderId;
    });
      this.productsOrders = JSON.parse(localStorage.getItem("OrdersCart"));
      this.email = localStorage.getItem("email");
  
      this.viewOrders = this.productsOrders.data;
      this.cartTotal = this.productsOrders.total;
       console.log(this.cartTotal);

    }

  ngOnInit(): void {
    this.userService.getUserDetails(this.email).subscribe(datas => {
      this.details = datas;
      this.name = this.details.fname+' '+this.details.lname;
      this.phone = this.details.phoneNumber;
      this.userId = this.details.id;
    });

   
  }

  lipaNaMpesa() {
    this.payService.orderPaymentStkOpen(this.phone,this.cartTotal,this.orderId,this.userId);
    //document.getElementById("notification-here").innerHTML="Check your phone to complete payments.<br> Didn't receive notification in My Phone <button class='btn' (click)='lipaNaMpesa()' style='color:red'>Re-try</button";
  }

}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityOrdered: number;
}
