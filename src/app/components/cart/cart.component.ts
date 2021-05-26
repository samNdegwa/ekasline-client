import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {CartModelServer} from '../../../models/cart.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  subTotal: number;
  serverURL2 = environment.SERVER_URL2;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  // tslint:disable-next-line:typedef
  ChangeQuantity(index: number, increase: boolean){
    this.cartService.updatecartItems(index, increase);
  }

}
