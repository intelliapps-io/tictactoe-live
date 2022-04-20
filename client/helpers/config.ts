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

// uncomment for localhost
config = {
  BASE_SERVER_URL: 'http://localhost:3000',
  WEBSOCKET_SERVER_URL: 'ws://localhost:3000'  
}


export { config }

