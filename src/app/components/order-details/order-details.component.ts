import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  serverURL = environment.SERVER_URL2;
  orderNumber;
  payMent;
  products;
  orderDetails;
  userDetails;
  orderAddress;

  constructor(private route: ActivatedRoute, private orderService: OrderService, 
              private payService: PaymentsService) { 
                this.route.params.subscribe(data => {
                  this.orderNumber = data.orderNumber;
                });

              }

  ngOnInit(): void {
   
    this.orderService.getOrderDetail(this.orderNumber).subscribe(prods =>{
      console.log(prods)
      this.products = prods;
    });

    this.payService.getOrderPayments(this.orderNumber).subscribe(data =>{
      this.payMent = data;
      console.log(data);
     });

     this.orderService.getOrder(this.orderNumber).subscribe(order =>{
      this.orderDetails = order;

      console.log('This is order details '+order)

      this.orderService.getUserDetails(this.orderDetails.user_id).subscribe(user =>{
        console.log('This is order details '+user)
        this.userDetails = user;
      });

    });

    this.orderService.getOrderAdress(this.orderNumber).subscribe(addr =>{
      this.orderAddress = addr;
    });
    
  }
 

}
