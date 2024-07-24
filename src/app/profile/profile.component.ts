import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/signin']);
    } else {
      this.http.get('http://localhost:3000/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          alert('Error fetching profile data');
          console.error(error);
        }
      );
    }
  }
}
