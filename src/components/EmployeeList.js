import React, { useEffect, useState } from 'react';
import AddEmployee from './AddEmployee'; 
import './EmployeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const loadEmployees = () => {
        fetch('https://apisolbeg20240317051023.azurewebsites.net/employees')
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleSelectionChange = (employeeId, isChecked) => {
        if (isChecked) {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        } else {
            setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
        }
    };

    const handleDeleteSelected = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete the selected employees?");
        if(confirmDelete){
            fetch('https://apisolbeg20240317051023.azurewebsites.net/employee', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedEmployees),
            })
            .then(() => {
                console.log('Empleados eliminados');
                loadEmployees(); 
                setSelectedEmployees([]);
            })
            .catch(error => console.error('Error:', error));
        }
        
    };

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="employeeList">
            <h2>List of employees</h2>
            <button className="button addbutton" onClick={() => {setEditingEmployeeId(null) 
                setShowAddEmployeeForm(true)}}>Add New Employee</button>
            <button className="button deleteButton" onClick={handleDeleteSelected} disabled={selectedEmployees.length === 0}>Delete selected Employees</button>
            <button className="button loadButton" onClick={loadEmployees}>Load employee list</button>

            {successMessage && (
                <div className="successMessage">{successMessage}</div>
            )}

            {showAddEmployeeForm && !editingEmployeeId && (                
                        <AddEmployee 
                            onCancel={() => setShowAddEmployeeForm(false)}
                            onSuccess={handleSuccess}
                        />
            )}

            {employees.length > 0 ? (
                <>                    
                    {employees.map((employee) => (
                        <div key={employee.id} className="employeeItem">
                            <input
                                type="checkbox"
                                onChange={(e) => handleSelectionChange(employee.id, e.target.checked)}
                                checked={selectedEmployees.includes(employee.id)}
                            />
                            Name: {employee.firstName} {employee.lastName}
                            <br />
                            Age: {employee.age} years
                            <br />
                            Sex: {employee.sex}
                            {(!editingEmployeeId || editingEmployeeId !== employee.id || !showAddEmployeeForm) && (
                                <button className="button edit" onClick={() => {
                                    setEditingEmployeeId(employee.id);
                                    setShowAddEmployeeForm(true);
                                }}>Edit</button>
                            )}
                            {editingEmployeeId === employee.id && showAddEmployeeForm && (
                                <AddEmployee 
                                    employeeToEdit={employee}
                                    onCancel={() => {
                                        setEditingEmployeeId(null);
                                        setShowAddEmployeeForm(false);
                                    }}
                                    onSuccess={handleSuccess}
                                    isEditing={!!editingEmployeeId}
                                />
                            )}
                        </div>
                    ))}

                </>
            ) : (
                <div>There are no employees listed. Please add some.</div>
            )}
        </div>
    );
}

export default EmployeeList;
