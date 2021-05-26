import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { EmailService } from 'src/app/services/email.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { ProductModelServer, ServerResponse } from 'src/models/product.model';


@Component({
  selector: 'app-product-paging',
  templateUrl: './product-paging.component.html',
  styleUrls: ['./product-paging.component.scss']
})
export class ProductPagingComponent implements OnInit {
  products: ProductModelServer[] = [];
serverURL2 = environment.SERVER_URL2;
page;
total_products = localStorage.getItem('pg');
total_pages;
t;
  constructor(private productService: ProductService,
              private  cartService: CartService,
              private router: Router,
              private email: EmailService, private route: ActivatedRoute) { 
                this.route.params.subscribe(data => {
                  this.page = data.page;
                });
               }

  ngOnInit(): void {
   this.total_pages= Math.ceil((parseInt(this.total_products))/16);
   this.populateProducts();
  }
  
  populateProducts(){
   
    const start_point = (this.page-1)*16;
    this.productService.getAllProducts(start_point).subscribe((prods: ServerResponse) => {
      this.products = prods.products;
    });

    // if(this.page == this.total_pages) {
    //   document.getElementById('btn-next-products').style.display = "none";
    // } else {
    //   if(this.page == '1') {
    //     document.getElementById('btn-previous-products').style.display = "none";
    //   } else {

    //   }

    // }
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
    if(this.page == this.total_pages) {} else {
    const a = parseInt(this.page);
    const next = a+1;
    this.router.navigateByUrl('/products/page/'+next).then(data =>{
      this.populateProducts();
    })
  }
   //this.populateProducts();
  }

  previous_page_product() {
    if(this.page == '1') {} else {
    const a = parseInt(this.page);
    const next = a-1;
    this.router.navigateByUrl('/products/page/'+next).then(data =>{
      this.populateProducts();
    })
  }
  }


}
