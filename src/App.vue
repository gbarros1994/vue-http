<template>
  <div id="app">
    
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Requisições HTTP no Vue</h1>
        <p class="lead">Usando a biblioteca Axios para fazer chamadas Ajax à uma API REST.</p>
      </div>
    </div>

    <div class="container">

      <TarefasLista />

      <button
        class="btn btn-primary mt-4 mb-2"
        @click="download">Bixar imagem
      </button>

      <div class="progress">
        <div 
          class="progress-bar" 
          :style="{ width: progresso + '%' }"
          :aria-valuenow="progresso"
          aria-valuemin="0"
          aira-value-max="100">
          {{ progresso }} %</div>
      </div>

      <div v-if="imagem">
        <img :src="imagem" alt="" class="w-100">
      </div>

    </div>

  </div>
</template>

<script>

import TarefasLista from './components/TarefasLista.vue'
import axios from 'axios'

export default {
    components: {
        TarefasLista
    },
    data() {
      return {
        progresso: 0,
        imagem: undefined
      }
    },
    methods: {
      download() {
        axios.get('https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
              console.log('fazendo donwload', progressEvent)
              this.progresso = (progressEvent.loaded / progressEvent.total * 100).toFixed(0)
            }
          }
        ).then(response => {
          console.log('concluido')

          const reader = new window.FileReader()
          reader.readAsDataURL(response.data)
          reader.onload = () => {
            this.imagem = reader.result
          }
        })
      }
    },
}
</script>