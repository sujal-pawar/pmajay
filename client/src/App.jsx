import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PMajayLanding from './pages/PMajayLanding';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PMajayLanding />} />
      </Routes>
    </Router>
  )
}

export default App
