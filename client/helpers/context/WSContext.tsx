import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-native";
import { io, Socket } from "socket.io-client";
import { config } from "../../helpers/config";
import { IGameSession, IPlayerInfo, IUser } from "../types";
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
  playerInfo: IPlayerInfo | null
  setPlayerInfo: (playerInfo: IPlayerInfo | null) => void
}

const WSContext = createContext<IWSContext>(null as any);

const WSProvider = ({ children }: { children: any }) => {
  const { authState } = useContext(AuthContext)
  const navigate = useNavigate()
  const [socket, setSocket] = useState(io(config.BASE_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    extraHeaders: {
      'Access-Control-Allow-Origin': config.BASE_SERVER_URL
    }
  }))
  const [gameSession, setGameSession] = useState<IGameSession | null>(null)
  const [gameOpponent, setGameOpponent] = useState<null | IUser>(null)
  const [playerInfo, setPlayerInfo] = useState<null | IPlayerInfo>(null)

  // game session listener
  useEffect(() => {
    socket.on('response_gamesession_update', (session: IGameSession) => {
      console.log(gameSession)
      setGameSession(session)
    })
    socket.on('response_set_opponent', (opponent) => {
      console.log(opponent)
      setGameOpponent(opponent)
    })
    socket.on('response_player_info', (info) => {
      console.log(info)
      setPlayerInfo(info)
    })
    socket.on('response_exit_game', () => {
      setGameSession(null)
      setGameOpponent(null)
      navigate('/')
    })
  }, [])

  return (
    <WSContext.Provider
      value={{ socket, gameSession, setGameSession, gameOpponent, setGameOpponent, playerInfo, setPlayerInfo }}
    >
      {children}
    </WSContext.Provider>
  )
}

export { WSContext, WSProvider };