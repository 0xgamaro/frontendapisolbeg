// App.js

import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';

function App() {
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const toggleForm = () => {
    setShowForm(!showForm); // Cambia el estado para mostrar/ocultar el formulario
  };

  return (
    <div className="App">
      {showForm && <AddEmployee />}
      <EmployeeList />
    </div>
  );
}

export default App;
