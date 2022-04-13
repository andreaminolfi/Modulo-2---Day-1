import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from './model/device';
import { NgForm } from '@angular/forms';

// il base path delle nostre API
const baseUrl = 'https://my-json-server.typicode.com/training-api/devices-api/';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // la collezione degli elementi da gestire
  devices: Device[] = [];
  active: Device | null = null;

  // inject del servizio HttpClient
  constructor(private http: HttpClient) {}

  // invocato automaticamente dal framework dopo il costruttore
  ngOnInit(): void {
    this.getAll();
  }

  // acquisisce un array di device
  getAll(): void {
    this.http.get<Device[]>(`${baseUrl}/devices`).subscribe((result) => {
      console.log(result);
      this.devices = result;
    });
  }

  delete(device: Device, event: MouseEvent) {
    event.stopPropagation();

    this.http.delete<any>(`${baseUrl}/devices/${device.id}`).subscribe(() => {
      const index = this.devices.findIndex((d) => d.id === device.id);
      this.devices.splice(index, 1);
    });
  }

  save(form: NgForm): void {
    // UPDATED
    if (this.active?.id) {
      this.edit(form.value);
    } else {
      this.add(form.value);
      form.reset(); // NEW
    }
  }

  add(device: Device) {
    this.http.post<Device>(`${baseUrl}/devices`, device).subscribe((res) => {
      this.devices.push(res);
      this.active = null; // NEW
    });
  }

  // NEW
  edit(device: Device) {
    this.http
      .patch<Device>(`${baseUrl}/devices/${this.active.id}`, device)
      .subscribe((res) => {
        const index = this.devices.findIndex((d) => d.id === this.active.id);
        this.devices[index] = res;
      });
  }

  setActiveHandler(device: Device): void {
    this.active = device;
  }

  counter(i: number) {
    return new Array(i);
  }
}
