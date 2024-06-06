import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages and nav component
import Nav from './components/NavBar/nav';
import Apple from './pages/Apple/Apple'

function App() {

  return (
    <>
      <Nav />
        <Routes>
          <Route path="" element={<Apple/>}/>
        </Routes>
    </>
  );
}

export default App;
