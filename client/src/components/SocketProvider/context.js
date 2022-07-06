import { createContext } from "react"; 

const SocketContext = createContext({  
  dataFeeds: [],
}); 
export default SocketContext;