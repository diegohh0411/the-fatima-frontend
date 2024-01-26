import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { rrulestr, datetime } from 'rrule';

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

  days = [0, 1, 2, 3, 4, 5, 6]
  namesOfTheDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  masses: Date[] = []
  getMassesOfTheDay(dayNumber: number) {
    return this.masses.filter(mass => {
      return mass.getDay() === dayNumber
    })
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
      recurrence: string
    }

    this.http.get<Datum[]>(`http://localhost:3000/mass`)
    .subscribe((data: Datum[]) => {
      data.forEach(datum => {
        console.log(datum)
        const rule = rrulestr(datum.recurrence)

        const now = new Date()
        const lastMonday = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate() - now.getDay() + 1,
          0
        )
        const thisSunday = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth() + 1,
          now.getDate() + (7 - now.getDay()) + 1,
          0
        )
        this.masses.push(... rule.between(lastMonday, thisSunday))
      })

      console.log(this.masses)
    }) 
  }

  ngOnInit() {
    this.getMasses()
  }
}
