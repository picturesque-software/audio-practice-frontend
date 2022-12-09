import axios from 'axios'

const http = axios.create({
    timeout: 1000 * 86400,
    withCredentials: true,
    // TODO 对接后端接口处
    // baseURL: " https://mock.presstime.cn/mock/637c3a55b358b9006b3e403b/audio",
    baseURL: "/audio",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})
// // 请求拦截
// http.interceptors.request.use(config => {
//     config.headers['Token'] = storage.get('Token') // 请求头带上token
//     return config
// }, error => {
//     return Promise.reject(error)
// })
// // 响应拦截
// http.interceptors.response.use(response => {
//     if (response.data && response.data.code === 401) { // 401, token失效
//         router.push({ name: 'login' })
//     }
//     return response
// }, error => {
//     return Promise.reject(error)
// })
export default http
