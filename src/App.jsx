import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="d-flex tex  vh-100 align-items-center justify-content-center">
      <div className="container py-4 px-3 mx-auto">
        <h1>Hello, Bootstrap and Vite!</h1>
        <button className="btn btn-primary">Primary button</button>
      </div>
    </div>
  );
}

export default App;
