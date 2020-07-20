import axios from 'axios'
import config from './config/config'

const instance = axios.create({})

instance.defaults.baseURL = config.apiURL

instance.interceptors.request.use(config => {
    console.log('interceptando requisição', config)
    config.data = {
        ...config.data,
        curso: 'Vue JS'
    }

    config.headers.common['Authorization'] = `Bearer token_jwt`
    config.headers.put['Meu-cabecalho'] = 'Curso vue'

    return config
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve(config)
    //     }, 2000);
    // })
}, error => {
    console.log('erro ao fazer requisição' + error)
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    console.log('interceptando resposta', response)

    if (Array.isArray(response.data)) {
        response.data = response.data.splice(1, 3)
    }
    return response
}, error => {
    console.log('erro capturado no intercep de resposta')
    return Promise.reject(error)
})

export default instance