import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../core/interfaces/role';

@Component({
  selector: 'red-tetris-sunbox',
  templateUrl: './sunbox.component.html',
  styleUrls: ['./sunbox.component.css'],
})
export class SunboxComponent implements OnInit {
  response: any;
  role = Role;
  constructor(private readonly httpClient: HttpClient) {}

  ngOnInit(): void {}
  sunbox(): void {
    this.httpClient.get('/api/sunbox').subscribe((data) => {
      this.response = data;
      console.log(data);
    });
  }
}
