import { WindowContextProvider } from "./context/WindowContext";
import ThreeRendering from "./three/ThreeRendering";

function App() {
  return (
    <div>
      <WindowContextProvider>
        <ThreeRendering />
      </WindowContextProvider>
    </div>
  );
}

export default App;
