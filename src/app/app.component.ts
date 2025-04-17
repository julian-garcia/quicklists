import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get('http://localhost:3000').subscribe(console.log)
    this.http.post('http://localhost:3000', {guess: 3}).subscribe(console.log)
  }
}
