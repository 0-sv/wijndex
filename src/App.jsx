import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WineRecommendations from "./components/WineRecommendations.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <WineRecommendations />
    </div>
  )
}

export default App
