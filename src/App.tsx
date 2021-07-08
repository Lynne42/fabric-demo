import React from 'react';
import './App.css';

// import FabricComponent from './demo/canvas';
// import FabricDragComponent from './demo/drawCanvas';
import FabricPolygonComponent from './demo/polygonCanvas';
// import FabricGridComponent from './demo/gridCanvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <FabricComponent/> */}
        {/* <FabricDragComponent/> */}
        <FabricPolygonComponent/>
        {/* <FabricGridComponent/> */}
      </header>
    </div>
  );
}

export default App;
