import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {API_URL} from "../../../config";
import {NgForOf} from "@angular/common";

interface UserScore {
  username: string;
  score: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  topUsers: UserScore[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchTopUsers();
  }

  startGame() {
    this.router.navigate(['/play']);
  }

  goToOptions() {
    this.router.navigate(['/play']);
  }

  fetchTopUsers() {
    this.http.get<UserScore[]>(`${API_URL}/api/plataformas/top10`).subscribe(
      (data: UserScore[]) => {
        this.topUsers = data;
      },
      (error: any) => {
        console.error('Error fetching top users:', error);
      }
    );
  }
}
