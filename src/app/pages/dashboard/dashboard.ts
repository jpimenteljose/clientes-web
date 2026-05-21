import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  // Atributo para exibir os dados na página
  resumoQuantitativo = signal<any>({});

  // Declarar um objeto da classe HttpClient
  http = inject(HttpClient);

  // Evento executado quando a página abrir
  ngOnInit() {

    // Fazer a requisição para os serviço de consultar o resumo quantitativo
    this.http.get('http://localhost:5258/api/v1/dashboard/resumo-quantitativo')
    .subscribe((data: any) => {
      this.resumoQuantitativo.set(data);
    });
  }
}
