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

//For in browser
let config: IConfig = {
  BASE_SERVER_URL: 'http://localhost:3000',
  WEBSOCKET_SERVER_URL: 'ws://localhost:3000'
}

if (window.location.href.indexOf('heroku') > -1) {
  config = {
    BASE_SERVER_URL: window.location.host,
    WEBSOCKET_SERVER_URL: window.location.host
  }
}

export { config }

