import { Routes } from '@angular/router';
import { CadastrarClientes } from './pages/cadastrar-clientes/cadastrar-clientes';
import { ConsultarClientes } from './pages/consultar-clientes/consultar-clientes';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: 'cadastrar-clientes',  // Rota
        component: CadastrarClientes // Componente
    },
    {
        path: 'consultar-clientes',  // Rota
        component: ConsultarClientes // Componente
    },
    {
        path: 'dashboard',   // Rota
        component: Dashboard // Componente
    },
    {
        path:'', pathMatch:'full', //raiz do projeto
        redirectTo:'/dashboard'    //redirecionamento
    }
];
