import { Component, OnInit } from '@angular/core';
import {CartModelServer} from '../../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ProductModelServer } from 'src/models/product.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;
  searchName: string;
  products: ProductModelServer[] = [];
  serverURL2 = environment.SERVER_URL2;

  constructor(public cartService: CartService,
              private route: Router,
              private userService: UserService,
              private productService: ProductService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

  // tslint:disable-next-line:typedef
  selectCategory(catName: string) {
    this.route.navigate(['products/category/', catName]).then();
  }

  submitSearch(form: NgForm) {
      const searchName: string = this.searchName;
       // @ts-ignore
      
        this.route.navigateByUrl('general-search/'+searchName).then(rel =>{
          location.reload(); 
        })
      
  }

  // posting() {
  //   this.http.post('http://ekasline.com/backend/api/create-payment.php', {
  //   order_id:272,
  //   amount:5000,
  //   reference:"gdr6r377373gx",
  //   payment_mode: "4ew562125",
  //   created_date: "15/03/2021"
  //   }).subscribe(res =>{
  //     console.log(res)
  //   })
  // }
}
