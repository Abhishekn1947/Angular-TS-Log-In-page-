import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/signin', {
      email: this.email,
      password: this.password
    }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      error => {
        alert('Login failed: ' + error.error);
        console.error(error);
      }
    );
  }
}
