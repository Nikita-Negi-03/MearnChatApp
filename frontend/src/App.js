import './App.css';
import {Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ChatProvider from './context/chatProvider';

function App() {
  return (
    <div className="App">
        <ChatProvider>
          <Routes>
            <Route path='/' Component={HomePage} />
            <Route path='/chats' Component={ChatPage} />
          </Routes>
        </ChatProvider>
    </div>
  );
}

export default App;
