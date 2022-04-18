interface IConfig {
  BASE_SERVER_URL: string
  WEBSOCKET_SERVER_URL: string 
}
//For mobile
// export const config: IConfig = {
//   BASE_SERVER_URL: 'http://10.71.55.254:3000',
//   WEBSOCKET_SERVER_URL: 'ws://10.71.55.254:3000'  
// }

// export const config: IConfig = {
//   BASE_SERVER_URL: 'http://192.168.1.201:3000',
//   WEBSOCKET_SERVER_URL: 'ws://192.168.1.201:3000'  
// }

const domain = 'https://tiktactoe-live.herokuapp.com'

//For in browser
let config: IConfig = {
  BASE_SERVER_URL: domain,
  WEBSOCKET_SERVER_URL: domain
}

if (window.location.href.indexOf('localhost') > -1) {
  config = {
    BASE_SERVER_URL: 'http://localhost:3000',
    WEBSOCKET_SERVER_URL: 'http://localhost:3000'
  }
}

export { config }

