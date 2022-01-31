import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('canv', { static: false }) canvas: ElementRef;

  public valutlist: Valuta;
  public valutitems: Array<Item>;
  public valutcurs: ValCurs;
  public cursarr: Array<Valute>;
  public selcurs: string = 'R01235';

  private http_std: HttpClient;
  private url_std: string;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http_std = http;
    this.url_std = baseUrl;
    http.get<Valuta>(baseUrl + 'valuta').subscribe(result => {
      this.valutlist = result;
      this.valutitems = this.valutlist.item;
      console.log("status: valuta - ok");
    }, error => console.error(error));
    http.get<string>(baseUrl + 'api/radiusload').subscribe(result => {
      this.radius = parseInt(result);
      this.Draw();
      console.log("status: radius load - ok");
    }, error => console.error(error));
    http.get<string>(baseUrl + 'api/valutload').subscribe(result => {
      this.selcurs = result.toString();
      console.log("status: valut load - ok");
    }, error => console.error(error));
  }

  public SaveValut() {
    this.http_std.get<string>(this.url_std + 'api/valutsave/?value=' + this.selcurs).subscribe(result => {
      console.log("status: radius save - ok");
    }, error => console.error(error));
  }

  public SaveRadius(val: string) {
    this.http_std.get<string>(this.url_std + 'api/radiussave/?value='+val).subscribe(result => {
      console.log("status: radius save - ok");
    }, error => console.error(error));
  }

  public GetCurs(dt: string) {
    this.http_std.get<ValCurs>(this.url_std + 'valcurs/?date=' + dt).subscribe(result => {
      this.valutcurs = result;
      this.cursarr = result.valute;
      console.log("status: valcurs - ok");
    }, error => console.error(error));
  }

  public Conv(): any {
    var e = this.cursarr.find(x => x.id == this.selcurs);
    var val = parseInt(e.value);
    var nom = parseInt(e.nominal);
    var res = (1 / val) * nom;
    if (res.toString().length > 5) return res.toString().slice(0, 5)
      else return res;
  }

  public context: CanvasRenderingContext2D;
  public cursor_x: number = 0;
  public cursor_y: number = 0;
  public manual_x: number = 0;
  public manual_y: number = 0;
  private x: number = 0;
  private y: number = 0;
  private pointSize:number = 3;
  public radius: number = 150;
  private angle: number = 2 * Math.PI / 4;
  private pads = [];
  private color = ["white", "white", "white", "white"];
  private Pads = function (x, y, radius, start, end) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.start = start;
    this.end = end;
  };

  private drawPlane() {
    this.context.lineWidth = 1;
    this.context.fillStyle = 'black';
    this.context.font = 'bold 18px serif';
    this.context.fillText("Y", this.x + (0.1 * this.x), 0.1 * this.y);
    this.context.moveTo(this.x, 2 * this.y);
    this.context.lineTo(this.x, 0.05 * this.y);
    this.context.lineTo(this.x - (0.01 * this.x), 0.08 * this.y);
    this.context.moveTo(this.x, 0.05 * this.y);
    this.context.lineTo(this.x + (0.01 * this.x), 0.08 * this.y);

    this.context.fillText("X", 2 * this.x - (0.1 * this.x), this.y - (0.1 * this.y));
    this.context.moveTo(0, this.y);
    this.context.lineTo(2 * this.x - (0.02 * this.x), this.y);
    this.context.lineTo(2 * this.x - (0.03 * this.x), this.y - (0.02 * this.y));
    this.context.moveTo(2 * this.x - (0.02 * this.x), this.y);
    this.context.lineTo(2 * this.x - (0.03 * this.x), this.y + (0.02 * this.y));

    this.context.fillStyle = 'red';

    this.context.fillText("I", 2 * this.x - (0.2 * this.x), 0.2 * this.y);
    this.context.fillText("II", 0.2 * this.x, 0.2 * this.y);
    this.context.fillText("III", 0.2 * this.x, 2 * this.y - (0.2 * this.y));
    this.context.fillText("IV", 2 * this.x - (0.2 * this.x), 2 * this.y - (0.2 * this.y));

    this.context.fillStyle = 'blue';
    this.context.fillText("Date = Today", 2 * this.x - (0.35 * this.x), this.y - this.radius);
    this.context.fillText("Date = Yesterday", 0.2 * this.x, this.y - this.radius);
    this.context.fillText("Date = Day Before Yesterday", 0.2 * this.x, this.y + this.radius);
    this.context.fillText("Date = Tomorrow", 2 * this.x - (0.35 * this.x), this.y + this.radius);

    this.context.stroke();
  }

  private drawCircle(radius) {
    for (var i = 0; i < 4; i++) {
      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      this.context.arc(this.x, this.y, radius, i * this.angle, (i + 1) * this.angle, false);
      this.context.lineWidth = radius;
      this.context.fillStyle = this.color[i];
      this.context.fill();
      this.context.lineWidth = 1;
      this.context.strokeStyle = '#444';
      this.context.stroke();
      var pad = new this.Pads(this.x, this.y, radius, i * this.angle, (i + 1) * this.angle);
      this.pads.push(pad);
    }
  }

  private Clear() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.width);
  }

  public mx: number = 0;
  public my: number = 0;

  private manualClick() {
    this.Draw();
    this.mx = Number(this.manual_x) + Number(this.x);
    this.my = Number(this.y) - Number(this.manual_y);
    this.drawCoordinates(this.mx, this.my);
    var dx = Math.abs(Math.abs(this.x) - Math.abs(this.mx));
    var dy = Math.abs(Math.abs(this.y) - Math.abs(this.my));
    var distance_clicked = Math.sqrt((dx * dx) + (dy * dy));
    if (distance_clicked <= this.radius) {
      var temp = new Date();
      if (this.manual_x == 0 && this.manual_y == 0) alert("Координата 0, 0");
      if (this.manual_x > 0 && this.manual_y > 0) {
        this.GetCurs(new Date().toDateString());
      } else if (this.manual_x < 0 && this.manual_y > 0) {
        var y = new Date(temp.setDate(temp.getDate() - 1));
        this.GetCurs(y.toDateString());
      } else if (this.manual_x > 0 && this.manual_y < 0) {
        var y = new Date(temp.setDate(temp.getDate() + 1));
        this.GetCurs(y.toDateString());
      } else if (this.manual_x < 0 && this.manual_y < 0) {
        var y = new Date(temp.setDate(temp.getDate() - 2));
        this.GetCurs(y.toDateString());
      }
    }
    else {
      alert('Координата не попала в радиус.');
    }
  }

  private getPosition(event) {
    this.Draw();
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    var zx = event.clientX - rect.left;
    var zy = event.clientY - rect.top;
    this.drawCoordinates(zx, zy);
    var nx, ny;
    nx = -(this.x - zx);
    ny = this.y - zy;
    this.cursor_x = nx;
    this.cursor_y = ny;
    var dx = Math.abs(Math.abs(this.x) - Math.abs(zx));
    var dy = Math.abs(Math.abs(this.y) - Math.abs(zy));
    var distance_clicked = Math.sqrt((dx * dx) + (dy * dy));
    if (distance_clicked <= this.radius) {
      var temp = new Date();
      if (nx == 0 && ny == 0) alert("Координата 0, 0");
      if (nx > 0 && ny > 0) {
        this.GetCurs(new Date().toDateString());
      } else if (nx < 0 && ny > 0) {
        var y = new Date(temp.setDate(temp.getDate() - 1));
        this.GetCurs(y.toDateString());
      } else if (nx > 0 && ny < 0) {
        var y = new Date(temp.setDate(temp.getDate() + 1));
        this.GetCurs(y.toDateString());
      } else if (nx < 0 && ny < 0) {
        var y = new Date(temp.setDate(temp.getDate() - 2));
        this.GetCurs(y.toDateString());
      }
    }
    else {
      alert('Координата не попала в радиус.');
    }
  }

  private drawCoordinates(x, y) {
    this.context.fillStyle = "#ff2626"; // Red color
    this.context.beginPath();
    this.context.arc(x, y, this.pointSize, 0, Math.PI * 2, true);
    this.context.fill();
  }

  public Draw()
  {
    this.SaveRadius(this.radius.toString());
    this.Clear();
    this.drawCircle(this.radius);
    this.drawPlane();
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = 1024;
    this.canvas.nativeElement.height = 720;
    this.context = this.canvas.nativeElement.getContext('2d');
    this.x = this.canvas.nativeElement.offsetWidth / 2;
    this.y = this.canvas.nativeElement.offsetHeight / 2;
  }
}

interface Item {
  name: string;
  engname: string;
  nominal: string;
  parentcode: string;
  id: string;
}

interface Valuta {
  item: Array<Item>;
  name: string;
}

interface Valute {
  numcode: string;
  charcode: string;
  nominal: string;
  name: string;
  id: string;
  value: string;
  conv: number;
}

interface ValCurs {
  valute: Array<Valute>;
  date: string;
  name: string;
}
