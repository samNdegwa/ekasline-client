import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private  SERVER_URL2: string = environment.SERVER_URL2;
  phone: String;
  constructor(private http: HttpClient, private toast: ToastrService,) { }

  orderPaymentStkOpen(phone: String, amount: Number,id: Number,userId: Number){
    this.phone = phone;
    this.http.get(this.SERVER_URL2 + '/mpesa/index.php?mpesa=true&phone='+phone+'&amount='+amount+'&id='+id+'&userId='+userId).subscribe(data =>{
       console.log(data);
    })
    this.toast.info('Check your Mobile Phone with simcard '+this.phone+' to complete payments','Confirm',{
      timeOut: 40000
    });
  }

  getOrderPayments(order_id: number) {
    return this.http.get(`${this.SERVER_URL2}/read-order-payments.php?order_id=`+order_id);
  }

  getUserPayments(userId : number) {
    return this.http.get(`${this.SERVER_URL2}/read-user-payments.php?userId=`+userId);
  }
}
