import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
@Component({
  selector: 'app-root',
  imports: [
    DatePickerModule,
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    TabsModule,
    RouterModule
],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('CampusFlow');
  date = new Date();
  stateOptions: any[] = [
    { label: 'One-Way', value: 'one-way' },
    { label: 'Return', value: 'return' },
  ];

  value: string = 'off';
}
