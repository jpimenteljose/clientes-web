import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consultar-clientes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './consultar-clientes.html',
  styleUrl: './consultar-clientes.css',
})
export class ConsultarClientes {

  // Atributo para armazenar os clientes consultados
  clientes = signal<any[]>([]);

  // Biblioteca HTTP Client para realizar as requisições HTTP
  http = inject(HttpClient);
  
  // Criando o formulário para consulta de clientes
  formConsulta = new FormGroup({
    nome : new FormControl('',[Validators.required, Validators.minLength(3)]),
  })

  // Função para realizar a consulta dos clientes
  consultarClientes() {
    this.http.get('http://localhost:5258/api/v1/clientes?nome=' + this.formConsulta.value.nome)
      .subscribe((data) => {
        //console.log(data);
        this.clientes.set(data as any[]);
      })
  }

  // Função para capturar um evento de exclusão de um cliente
  excluirCliente(id : string) {
    if(confirm('Deseja realmente excluir este cliente?')){
      // Fazendo a requisição para excluir o cliente
      this.http.delete('http://localhost:5258/api/v1/clientes/' + id)
        .subscribe((data : any) => {
          alert(data.message); // Exibe a mensagem de sucesso ou erro retornada pela API
          this.consultarClientes(); // Recarrega a lista de clientes após a exclusão
        });
    }
  }
    

  
}
