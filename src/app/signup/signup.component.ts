import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.http.post('http://localhost:3000/signup', {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(
      () => {
        alert('Signup successful');
        this.router.navigate(['/signin']);
      },
      error => {
        alert('Signup failed: ' + (error.error.error || error.error));
        console.error(error);
      }
    );
  }
}
