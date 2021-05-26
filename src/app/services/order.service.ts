import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class OrderService {
  private products: ProductResponseModel[] =[];
  private  SERVER_URL2 = environment.SERVER_URL2;

  constructor(private http: HttpClient ) { }

  // tslint:disable-next-line:typedef
  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL2 + '/read-order-details.php?id=' + orderId).toPromise();
  }

  getUserOrders(id: number) {
    return this.http.get(`${this.SERVER_URL2}/user-orders.php?user_id=`+id);
  }

  getOrderDetail(id: number){
    return this.http.get(`${this.SERVER_URL2}/read-order-details.php?id=`+id);
  }

  getOrder(id: number){
    return this.http.get(`${this.SERVER_URL2}/read-single-order.php?id=`+id);
  }

  getUserDetails(id: number) {
    return this.http.get(`${this.SERVER_URL2}/read-user-by-id.php?id=`+id);
  }

  getOrderAdress(id: number) {
    return this.http.get(`${this.SERVER_URL2}/read-order-address.php?order_id=`+id);

  }

}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
