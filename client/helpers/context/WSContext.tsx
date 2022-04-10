import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-native";
import { io, Socket } from "socket.io-client";
import { config } from "../../helpers/config";
import { IGameSession, IPlayerInfo, IUser, IWinResult } from "../types";
import { AuthContext } from "./AuthContext";

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

export type ISocket = Socket<DefaultEventsMap, DefaultEventsMap>

interface IWSContext {
  socket: ISocket
  gameSession: IGameSession | null
  setGameSession: (session: IGameSession | null) => void
  gameOpponent: IUser | null
  setGameOpponent: (opponent: IUser | null) => void
}

const WSContext = createContext<IWSContext>(null as any);

const WSProvider = ({ children }: { children: any }) => {
  const { authState } = useContext(AuthContext)
  const navigate = useNavigate()
  const [socket, setSocket] = useState(io(config.BASE_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
    extraHeaders: {
      'Access-Control-Allow-Origin': config.BASE_SERVER_URL
    }
  }))
  const [gameSession, setGameSession] = useState<IGameSession | null>(null)
  const [gameOpponent, setGameOpponent] = useState<null | IUser>(null)

  // game session listener
  useEffect(() => {
    socket.on('response_set_opponent', (opponent) => {
      console.log(opponent)
      setGameOpponent(opponent)
    })
    socket.on('response_exit_game', () => {
      setGameSession(null)
      setGameOpponent(null)
      console.log('exit')
      navigate('/')
    })
    socket.on('all', () => {
      setGameSession(null)
      setGameOpponent(null)
      console.log('exit')
      navigate('/')
    })
    socket.on('gamesession_updated', (data) => {
      console.log(data)
      setGameSession(data)
    })
  }, [])

  // socket connect
  useEffect(() => {
    if (authState.user) {
      socket.auth = { userID: authState.user._id }
      socket.connect()
    }
  }, [authState])

  return (
    <WSContext.Provider
      value={{ socket, gameSession, setGameSession, gameOpponent, setGameOpponent }}
    >
      {children}
    </WSContext.Provider>
  )
}

export { WSContext, WSProvider };