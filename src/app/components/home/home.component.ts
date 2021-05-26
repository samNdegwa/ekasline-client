import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelServer, ServerResponse} from '../../../models/product.model';
import {CartService} from '../../services/cart.service';
import {EmailService} from '../../services/email.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
products: ProductModelServer[] = [];
serverURL2 = environment.SERVER_URL2;
page;
total_products;
total_pages;

  constructor(private productService: ProductService,
              private  cartService: CartService,
              private router: Router,
              private email: EmailService) { }

  ngOnInit(): void {
    this.productService.productCount().subscribe(data =>{
      this.total_products = data;
      this.total_products = this.total_products;
      localStorage.setItem('pg',this.total_products);
    })
    this.productService.getAllProducts(0).subscribe((prods: ServerResponse) => {
      this.products = prods.products;
      console.log(prods);
    });
    
  }
  // tslint:disable-next-line:typedef
  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  // tslint:disable-next-line:typedef
  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

  // tslint:disable-next-line:typedef
  selectCategory(catName: string) {
    this.router.navigate(['/products-search/', catName]).then();
  }

  next_page_product() {
    this.router.navigate(['/products/page/',2]).then();
  }
}
