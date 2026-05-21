import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-clientes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-clientes.html',
  styleUrl: './editar-clientes.css',
})
export class EditarClientes {
  
  // Atributo para armazenar os dados vindos da consulta da API
  niveisCliente = signal<any[]>([]);
  
  // Atributos para exibir mensagens de sucesso ou erro para o usuário
  mensagemSucesso = signal('');
  mensagemErro = signal('');

  // Atributo para armazenar id ID do cliente a ser editado
  idCliente = signal('');

  // Instanciar a classe HttpClient
  http = inject(HttpClient);

  // Biblioteca para capturar o id enviado na URL
  router = inject(ActivatedRoute);

  // Formulário para capturar os campos de edição do cliente
  formEdicao = new FormGroup({
    nome : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(150)]),
    cpf : new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    email : new FormControl('', [Validators.required, Validators.email]),
    telefone : new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    nivel : new FormControl('', [Validators.required]),
  })

  // Função executada ao abrir o componente
  ngOnInit() {

    // Capturar o ID do cliente enviado na URL
    this.idCliente.set(this.router.snapshot.paramMap.get('id')!);

    // Fazendo uma consulta que possa buscar os dados do cliente na API através do ID
    this.http.get('http://localhost:5258/api/v1/clientes/' + this.idCliente())
      .subscribe((data : any) => {
        // Preecher o formulário com os dados do cliente para edição
        this.formEdicao.patchValue(data);
      });

    // Fazendo uma chamada/requisição para o endpoint da api de clientes
    // para consultar as opções do enum de níveis de cliente
    this.http.get('http://localhost:5258/api/enum/niveis-cliente')
      .subscribe((data) => {
        // Armazernar os dados da API na variável signal
        this.niveisCliente.set(data as any[]);
      });
  }

  // Função para capturar o evento de SUBMIT do formulário
  atualizarCliente() {
  
    // Limpar as mensagens de sucesso ou erro
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');
    
    // console.log(this.formCadastro.value);
    
    // Fazendo uma requisição POST para a API (cadastro do cliente)
    this.http.put('http://localhost:5258/api/v1/clientes/' + this.idCliente(), this.formEdicao.value)
      .subscribe({
        next : (data:any) => { // Capturando o retorno de sucesso da API 
          this.mensagemSucesso.set(data.message); // Exibir a mensagem de sucesso para o usuário
          //console.log(data);
        },
        error : (e) => { // Caturando o retorno de erro da API
          // Verificando o status do erro
          switch (e.status) {
            case 400: // Bad Request - Erro de validação
              this.mensagemErro.set(e.error.errors.Cpf[0]);
              break;
            case 422: // Unprocessable Entity - Erro da validação  
              this.mensagemErro.set(e.error.message); // Exibir a mensagem de erro para o usuário
              break;
            case 500: // Internal Server Erro - Erro no servidor
              this.mensagemErro.set('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.'); 
              break;
        }  
          //console.log(e.error );  
        }
      })
  }

}
