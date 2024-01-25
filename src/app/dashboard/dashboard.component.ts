import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private http: HttpClient
  ) {}

  masses: any = {}
  get massesKeys() {
    return Object.keys(this.masses)
  }
  async getMasses() {
    interface Datum {
      UUID: string,
      celebratingPriests: {
        UUID: string,
        email: string,
        first_name: string,
        last_name: string|null,
        role: string 
      }[],
      hour: string,
      weekday: string,
      note: string|null
    }

    this.http.get<Datum[]>(`http://localhost:3000/mass`)
    .subscribe((data: Datum[]) => {
      data.forEach(datum => {
        if (!this.masses[datum.weekday]) {
          this.masses[datum.weekday] = [{hour: datum.hour, note: datum.note, UUID: datum.UUID}]
        } else {
          this.masses[datum.weekday].push({hour: datum.hour, note: datum.note, UUID: datum.UUID})
        }
      })

      console.log(this.masses)
    })
    
  }

  ngOnInit() {
    this.getMasses()
  }
}
