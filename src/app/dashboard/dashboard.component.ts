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

      // Sort masses by weekday
      const orderedWeekdays = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
      const actualWeekdays = Object.keys(this.masses)
      actualWeekdays.sort((a: string, b: string) => {
        return orderedWeekdays.indexOf(a) - orderedWeekdays.indexOf(b)
      })
      const orderedMasses: any = {}
      actualWeekdays.forEach(weekday => {
        orderedMasses[weekday] = this.masses[weekday]
      })
      this.masses = orderedMasses

      // Sort masses arrays by hour
      Object.values(this.masses).forEach((weekday: any) => {
        weekday.sort((a: any, b: any) => {
          // Parse strings to numbers for comparison
          const hourA = parseInt(a.hour.split(':')[0]); 
          const hourB = parseInt(b.hour.split(':')[0]);
          
          return hourA - hourB;
        });
      })
    })    
  }

  ngOnInit() {
    this.getMasses()
  }
}
