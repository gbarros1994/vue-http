<template>
    <div>
        <div class="row">
            <div class="col-sm-10">
                <h1 class="font-weight-light">Lista de tarefas</h1>
            </div>
            <div class="col-sm-2">
                <button @click="exibirFormularioCriarTarefa" class="btn btn-primary float-right">
                    <i class="fa fa-plus mr-2"></i>
                    <span>Criar</span>
                </button>
            </div>
        </div>

        <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
            <TarefasListaIten
                v-for="tarefa in tarefasOrdenadas"
                :key="tarefa.id"
                :tarefa="tarefa" 
                @editar="selecionarTarefaParaEdicao"
                @deletar="deletarTarefa"
                @concluir="editarTarefa"/>
        </ul>

        <p v-else-if="!mensagemErro">{{ mensagemErro }}.</p>

        <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

        <TarefaSalvar 
            v-if="exibirFormulario"
            :tarefa="tarefaSelecionada"
            @criar="criarTarefa"
            @editar="editarTarefa" />

    </div>
</template>

<script>

import axios from './../axios'

import TarefaSalvar from './TarefaSalvar.vue'
import TarefasListaIten from './TarefasListaIten.vue'

export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        }
    },
    computed: {
        tarefasOrdenadas() {
            return this.tarefas.sort((t1, t2) => {
                if (t1.concluido === t2.concluido) {
                    return t1.titulo < t2.titulo
                    ? -1
                    : t1.titulo > t2.titulo
                    ? 1
                    : 0
                }
                return t1.concluido - t2.concluido
            })
        }
    },
    created() {
        axios
        .get(`/tarefas`)
        .then((response) => {
            this.tarefas = response.data
        }, error => {
            return Promise.reject(error)
        }).catch(error => {
            // alert('erro no catch')
            if (error.response) {
                this.mensagemErro = 'Servidor retornou um erro' + error.message +' Nº erro '+ error.response.status
            } else if (error.request) {
                this.mensagemErro = 'Erro ao tentar comunicar com servidor' + error.message
            } else {
                this.mensagemErro = 'Erro ao fazer requisição ao servidor' + error.message
            }
        })
    },
    methods: {
        criarTarefa(tarefa) {
            // axios
            // .post(`/tarefas`, tarefa)
            // .then((response)=> {
            //     this.tarefas.push(response.data)
            //     this.resetar()
            // })
            axios.request({
                method: 'post',
                // baseURL: config.apiURL,
                url: `/tarefas`,
                data: tarefa
            })
            .then((response)=> {
                this.tarefas.push(response.data)
                this.resetar()
            })
        },
        editarTarefa(tarefa) {
            axios
            .put(`/tarefas/${tarefa.id}`, tarefa)
            .then(() => {
                const indice = this.tarefas.findIndex(t => t.id == tarefa.id)
                this.tarefas.splice(indice, 1, tarefa)
                this.resetar()
            })
        },
        async deletarTarefa(tarefa) {
            const confirmar = window.confirm(`Deseja deletar a tarefa ${tarefa.titulo} ?`)
            if (confirmar) {
                // axios
                // .delete(`/tarefas/${tarefa.id}`)
                // .then(() => {
                //     const indice = this.tarefas.findIndex(t => t.id == tarefa.id)
                //     this.tarefas.splice(indice, 1)
                // })

                try {
                    const response = await axios.delete(`/tarefas/${tarefa.id}`)
                    const indice = this.tarefas.findIndex(t => t.id == tarefa.id)
                    this.tarefas.splice(indice, 1)
                } catch (error) {
                    console.log('erro')
                } finally {
                    console.log('sempre executado')
                }
            }
        },
        exibirFormularioCriarTarefa() {
            if (this.tarefaSelecionada) {
                this.tarefaSelecionada = undefined
                return
            }
            this.exibirFormulario = !this.exibirFormulario
        },
        resetar(){
            this.tarefaSelecionada = undefined
            this.exibirFormulario = false
        },
        selecionarTarefaParaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa
            this.exibirFormulario = true
        }
    },
}
</script>
