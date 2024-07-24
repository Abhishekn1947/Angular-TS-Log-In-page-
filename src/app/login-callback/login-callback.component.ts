import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/callback').subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      (error) => {
        alert('Login callback failed');
        console.error(error);
      }
    );
  }
}
