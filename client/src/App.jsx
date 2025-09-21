import pmAjayLogo from './assets/pm-ajay logo.png'
import azadi75Logo from './assets/azadi75-logo.png'
import namoImage from './assets/namo.jpeg'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={pmAjayLogo} alt="PM-AJAY Logo" className="pm-ajay-logo" />
          <div className="navbar-text">
            <h3>Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)</h3>
            <p>Department of Social Justice & Empowerment</p>
          </div>
        </div>
        <div className="navbar-right">
          <img src={azadi75Logo} alt="Azadi 75 Logo" className="azadi75-logo" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="center-image">
          <img src={namoImage} alt="Namo" className="namo-image" />
        </div>
      </main>
    </div>
  )
}

export default App
