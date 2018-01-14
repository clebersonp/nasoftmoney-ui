import { PessoaService, PessoaFiltro } from './../pessoa.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../../seguranca/auth.service';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { Title } from '@angular/platform-browser';

import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit  {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela') grid;

   constructor(private pessoaService: PessoaService,
              private toasty: ToastyService,
              private auth: AuthService,
              private errorHandler: ErrorHandlerService,
              private confirmation: ConfirmationService,
              private title: Title) { }

  ngOnInit() {
     this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
         this.totalRegistros = resultado.total;
         this.pessoas = resultado.pessoas;
        });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

 confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir a Pessoa ?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

 excluir(lancamento: any) {
    this.pessoaService.excluir(lancamento.codigo)
      .then(() => {
         if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }
        this.toasty.success('Lançamento excluí­do com sucesso!');
      }).catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    let novoStatus: string;
    if (pessoa.ativo === 'A') {
        novoStatus = 'I';
    } else {
        novoStatus = 'A';
    }

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus === 'A' ? 'ativada' : 'inativada';

        pessoa.ativo = novoStatus;
        this.toasty.success(`Pessoa ${acao} com sucesso!`);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
