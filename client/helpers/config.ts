interface IConfig {
  BASE_SERVER_URL: string
  WEBSOCKET_SERVER_URL: string 
}

const domain = 'https://tiktactoe-live.herokuapp.com'

//For in browser
let config: IConfig = {
  BASE_SERVER_URL: domain,
  WEBSOCKET_SERVER_URL: domain
}

//For mobile
// export const config: IConfig = {
//   BASE_SERVER_URL: 'http://10.71.55.254:3000',
//   WEBSOCKET_SERVER_URL: 'ws://10.71.55.254:3000'  
// }


export { config }

