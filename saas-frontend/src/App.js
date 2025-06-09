import logo from './logo.svg';
import './App.css';
import LateralMenu from './components/LateralMenu/LateralMenu';

function App() {
  return (
    <div className="App">
      <LateralMenu />
      <div className="main-content">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </div>
  );
}

export default App;
