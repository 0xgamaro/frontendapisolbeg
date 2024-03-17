// App.js

import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';

function App() {
  
  return (
    <div className="App">
      {showForm && <AddEmployee />}
      <EmployeeList />
    </div>
  );
}

export default App;
