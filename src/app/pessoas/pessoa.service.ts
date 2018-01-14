import { Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from './../../environments/environment';

import { Pessoa } from './../core/model';

import 'rxjs/add/operator/toPromise';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

  pessoasUrl: string;

  constructor(private http: AuthHttp) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
   }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const params = new URLSearchParams();
    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());
    params.set('filtro','filtro');

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }
    return this.http.get(`${this.pessoasUrl}`,
        { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const pessoas = responseJson.content;

        const resultado = {
          pessoas,
          total: responseJson.totalElements
        };
        return resultado;
      });
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`,
        JSON.stringify(pessoa), {  })
      .toPromise()
      .then(response => {
        const pessoaAlterado = response.json() as Pessoa;

        return pessoaAlterado;
      });
  }


  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoasUrl}/${codigo}`, { })
      .toPromise()
      .then(response => {
        const pessoa = response.json() as Pessoa;
        return pessoa;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoasUrl, {})
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`, {})
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: string): Promise<void> {
    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, {})
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Pessoa): Promise<Pessoa> {
    return this.http.post(this.pessoasUrl,
        JSON.stringify(lancamento), {})
      .toPromise()
      .then(response => response.json());
  }

}
