import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {CartModelPublic, CartModelServer} from '../../models/cart.model';
import {BehaviorSubject} from 'rxjs';
import {NavigationExtras, Router} from '@angular/router';
import {ProductModelServer} from '../../models/product.model';
import {environment} from '../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import { EmailService } from './email.service';



@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class CartService {
 // private serverURL = environment.SERVER_URL;
  private serverURL2 = environment.SERVER_URL2;
  userEmail = localStorage.getItem('email');
  userName = localStorage.getItem('user');
// data variables to store the cart information on the clients local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };
  // data variables to store cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };
  /* OBSERVEBLE FOR THE COMPONENTS TO SUBSCRIBLE */
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);



  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private Spinner: NgxSpinnerService,
              private emailService: EmailService) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // Get information from local storage (if any)
    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    // Check if the info  variable is null or has some data in it

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // local storage not empty and has some information
      this.cartDataClient = info;

      // loop through each entry and put it in the cartDataServer
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualPoductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualPoductInfo;
            // TODO create CalculateTotal function and replace it here
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            // cartDataServer already has some entry in it
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualPoductInfo
            });
            // TODO Create CalculateTotal function and replace it here
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        });
      });

    }

  }
  // tslint:disable-next-line:typedef
  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe(prod => {
      // 1. If the cart is empty
      if(this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        // TODO CALCULATE TOTAL AMOUNT
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        // TODO DISPLAY TOAST NOTIFICATION
        this.toast.success(`${prod.name} Added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
      // 2. If cart has some items
      else {
        const index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);
        //     a. If that item is already in the cart (Index is positive value)
        if (index !== -1) {
          if ( quantity !== undefined && quantity < prod.quantity) {
            // tslint:disable-next-line:max-line-length
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // tslint:disable-next-line:max-line-length no-unused-expression
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          // TODO DISPLAY A TOAST NOTIFICATION
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        //     b. If that item is not in the cart
        else {
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });
          // TODO DISPLAY A TOAST NOTIFICATION
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.success(`${prod.name} Added to the cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        }  // end else

      }

    });
  }
  // tslint:disable-next-line:typedef
 updatecartItems(index: number, increase: boolean) {
    const data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      // TODO CALCULATE THE TOTAL AMOUNT
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
       data.numInCart--;
       if (data.numInCart < 1) {
         // TODO DELETE THE PRODUCT FROM THE CART
         this.DeleteProductFromCart(index);
         this.cartData$.next({...this.cartDataServer});
       } else {
         this.cartData$.next({...this.cartDataServer});
         this.cartDataClient.prodData[index].incart = data.numInCart;
         // TODO CALCULATE THE TOTAL AMOUNT
         this.CalculateTotal();
         this.cartDataClient.total = this.cartDataServer.total;
         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
       }
    }

 }

  // tslint:disable-next-line:typedef
 DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      // TODO CALCULATE TOTAL AMOUNT
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}]};
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
      }

    }
    else {
      // If the user click cancel button
      return;
    }
 }
  // tslint:disable-next-line:typedef
 private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
 }
 //order details
 //user_id: number,date_placed: string,amount_due: number,
 //Address details
// phone: string, county: string, subCounty: string, city: string, postAddress: string, desc: string

  
CheckoutFromCart(
  //order details
  user_id: number,date_placed: string,amount_due: number,
  //Address details
 phone: string, county: string, subCounty: string, city: string, postAddress: string, desc: string) {
    //Storing order to server
  this.http.post<OrderResponse>(`${this.serverURL2}/ceate-order.php`,{user_id: user_id, 
  date_placed: date_placed,
  amount_due: amount_due})
  .subscribe((res) =>{
    console.log(res);
  if(res.message === 'Success'){
    //Storing Order Details to serve
    var order_id = res.order_id;
    var catLen = this.cartDataClient.prodData.length
    console.log(catLen);
    var i = 0;
    for(i=0;i<catLen;i++){
      var prodId = this.cartDataClient.prodData[i].id;
      var quantity = this.cartDataClient.prodData[i].incart;
      this.http.post(`${this.serverURL2}/create-order-details.php`,{
      order_id: order_id, product_id: prodId,quantity: quantity})
      .subscribe((data: OrderResponse) =>{
    
    })
    }

    this.emailService.sendOrderToUserEmail(this.userName,this.userEmail,catLen,amount_due,order_id);
    
    // Storing Addresses to server
    this.http.post(`${this.serverURL2}/create-addresses.php`, {
      phone_number: phone,
      county_to_send: county,
      sub_county: subCounty,
      city: city,
      postal_address: postAddress,
      description: desc,
      order_id: order_id
    }).subscribe((data: AddressResponse) => {
      //..................................... Order placed successifully 
      this.orderService.getSingleOrder(order_id).then(prods => {
          const navigationExtra: NavigationExtras = {
            state: {
              message: "success",
              products: prods,
              orderId: order_id,
              total: this.cartDataClient.total
            }
          };
    // Unable to complete spinner hide (vid 11 at 8 min)
          this.Spinner.hide();
          localStorage.setItem('OrdersCart', JSON.stringify(this.cartDataServer));
          this.router.navigate(['/thankyou'], navigationExtra).then(p => {
            this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}]};
            this.cartTotal$.next(0);
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          });

      });

    });
  } else {
    alert("failed to place order");
  }
  
})



}

  // tslint:disable-next-line:typedef
 private  resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
    };
    this.cartData$.next({...this.cartDataServer});
 }
  // tslint:disable-next-line:typedef
 calculateSubToatal(index): number {
    let subTotal = 0;
    const p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal;
}


}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }];

}

interface AddressResponse {
  phone_number: string;
  county_to_send: string;
  sub_county: string;
  city: string;
  postal_address: string;
  description: string;
  user_id: number
}

