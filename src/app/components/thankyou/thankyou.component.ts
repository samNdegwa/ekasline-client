import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import {OrderService} from '../../services/order.service';
import jsPDF, * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
  providers: [DatePipe]
})
export class ThankyouComponent implements OnInit {
  message: string;
  orderId: number;
  products: ProductResponseModel[] = [];
  cartTotal: number;
  productsOrders;
  viewOrders;
  myDate;
  serverURL2 = environment.SERVER_URL2;

  constructor(private router: Router,
              private orderService: OrderService,private datePipe: DatePipe) {
    const navigation = this.router.getCurrentNavigation();

    const state = navigation.extras.state as {
      message: string,
      products: ProductResponseModel[];
      orderId: number,
      total: number
    };
    this.message = state.message;
    this.products = state.products;
    this.orderId = state.orderId;
    this.cartTotal = state.total;

    this.productsOrders = JSON.parse(localStorage.getItem("OrdersCart"));

    this.viewOrders = this.productsOrders.data;
  }

  ngOnInit(): void {
    console.log(this.viewOrders)
  }

  // lipaNaMpesa() {
  //   this.router.navigate(['/order-payment']);
  // }

  downloadInvoice(): void {
    this.myDate=new Date();
    let latest_date =this.datePipe.transform(this.myDate, 'yyyy-MM-dd  hh:mm:ss');
    const doc = new jsPDF();
    doc.setFontSize(7);
    doc.text('This is system generated document ',10,285);
    doc.text('Receipt Generated on '+latest_date,150,285);
    var img = new Image();
    img.src = "assets/img/ekasline.png";
    
       //doc.text('Testing pdf', 10,10);
       doc.addFont("MyFont.ttf", "MyFont", "normal");
       doc.setFont("MyFont");
       doc.setFontSize(14);
       doc.addImage(img,5, 5, 40, 20);
       doc.text('EKASLINE ELECTRONIC LTD',50,10);
       doc.text('P.O. BOX 3100-10140 TEL: 0724315581',50,15);
       doc.text('Email: orders@ekasline.com',50,20);
       doc.text('Website: www.ekasline.com',50,25);
      // doc.text('----------------------------------------------------------------------------------',5,30)
       doc.line(5, 30, 200, 30);
       
       doc.setFontSize(14);
       doc.addFont("MyFont.ttf", "MyFont", "bold");
       doc.text("INVOICE",150,35);
       
       doc.setFontSize(10);
       doc.addFont("MyFont.ttf", "MyFont", "normal");
       doc.text("Number",130,40);
       doc.text(String(this.orderId),135,45);
       doc.text("Date",170,40);
       doc.text(latest_date,160,45);
      
      var res = (doc as any).autoTableHtmlToJson(document.getElementById("contentToConvert"));
      (doc as any).autoTable(res.columns, res.data, {margin: {top: 55}});
      
        doc.save('order '+this.orderId+'.pdf');
     

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
