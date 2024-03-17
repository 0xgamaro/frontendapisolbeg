import React, { useState, useEffect } from 'react';
import './AddEmployee.css';

function AddEmployee({ employeeToEdit, onCancel, onSuccess }) {
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        age: '',
        sex: '',
    });

    const handleCancel = () => {
        setEmployee({
            firstName: '',
            lastName: '',
            age: '',
            sex: '',
        });

        if (onCancel) onCancel();
    };

    useEffect(() => {
        if (employeeToEdit) {
            setEmployee(employeeToEdit);
        }
    }, [employeeToEdit]);

    const [errors, setErrors] = useState({}); 

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!employee.firstName) {
            formIsValid = false;
            errors["firstName"] = "First name is required.";
        }

        if (!employee.lastName) {
            formIsValid = false;
            errors["lastName"] = "Last name is required.";
        }

        if (!employee.sex) {
            formIsValid = false;
            errors["sex"] = "Gender is required.";
        }

        if (!employee.age || employee.age < 18 || employee.age > 100) {
            formIsValid = false;
            errors["age"] = "Age must be between 18 and 100 years.";
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.error('Validación fallida.');
            return;
        }
        const apiUrl = 'http://localhost:5095/employee';

        const url = employeeToEdit ? `${apiUrl}/${employeeToEdit.id}` : apiUrl;
        const method = employeeToEdit ? 'PUT' : 'POST'; 
        
        console.log('Formulario válido, enviando datos...', employee);
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Verifica si la respuesta tiene contenido
            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            console.log('Operación exitosa:', data);
            const successMsg = employeeToEdit ? 'Successfully modified employee.' : 'Successfully created employee.';
            onSuccess(successMsg); 
            handleCancel(); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    return (
        <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
            {errors.firstName && <div style={{ color: "red" }}>{errors.firstName}</div>}
                <input
                    type="text"
                    name="firstName"
                    value={employee.firstName}
                    onChange={handleChange}
                    placeholder="Name"
                />
                
            </div>

            <div>
            {errors.lastName && <div style={{ color: "red" }}>{errors.lastName}</div>}
                <input
                    type="text"
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleChange}
                    placeholder="LastName"
                />
               
            </div>

            <div>
            {errors.age && <div style={{ color: "red" }}>{errors.age}</div>}
                <input
                    type="number"
                    name="age"
                    value={employee.age}
                    onChange={handleChange}
                    placeholder="Age"
                />
                
            </div>

            <div>
            {errors.sex && <div style={{ color: "red" }}>{errors.sex}</div>}
                <input
                    type="text"
                    name="sex"
                    value={employee.sex}
                    onChange={handleChange}
                    placeholder="Sex"
                />
                
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit"> Accept </button>
                <button type="button" onClick={handleCancel}> Cancel </button>
            </div>
        </form>

    );
}

export default AddEmployee;