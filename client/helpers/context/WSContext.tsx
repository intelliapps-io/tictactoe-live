import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../../helpers/config";
import { AuthContext } from "./AuthContext";

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

export type ISocket = Socket<DefaultEventsMap, DefaultEventsMap>

interface IWSContext {
  socket: ISocket
}


const WSContext = createContext<IWSContext>(null as any);

const WSProvider = ({ children }: { children: any }) => {
  const { authState } = useContext(AuthContext)
  const [socket, setSocket] = useState(io(config.BASE_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    extraHeaders: {
      'Access-Control-Allow-Origin': config.BASE_SERVER_URL
    }
  }))

  useEffect(() => {
    if (authState.user)
      socket.auth = { sessionID: authState.user._id }
    else
      socket.auth = { sessionID: null}
  }, [authState])

  return (
    <WSContext.Provider
      value={{ socket }}
    >
      {children}
    </WSContext.Provider>
  )
}

export { WSContext, WSProvider };