import React, { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value, onChange, name = "password", placeholder = "Contraseña segura" }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

    // Estado de las validaciones
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Validar cada vez que el valor cambia
    useEffect(() => {
        setValidations({
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            special: /[@$!%*?&]/.test(value) // Mismos caracteres que en el Backend
        });
    }, [value]);

    const isValid = Object.values(validations).every(Boolean);

    // Componente pequeño para cada item de la lista
    const ValidationItem = ({ fulfilled, text }) => (
        <li className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
            fulfilled ? 'text-green-600 font-medium' : touched ? 'text-red-400' : 'text-gray-400'
        }`}>
            {fulfilled ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
            {text}
        </li>
    );

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        setTouched(true);
                        onChange(e);
                    }}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                        touched && !isValid
                            ? 'border-red-300 focus:ring-red-200 bg-red-50'
                            : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Checklist Visual */}
            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Requisitos de Seguridad:
                </p>
                <ul className="grid grid-cols-1 gap-1">
                    <ValidationItem fulfilled={validations.length} text="Mínimo 8 caracteres" />
                    <ValidationItem fulfilled={validations.uppercase} text="Al menos una mayúscula (A-Z)" />
                    <ValidationItem fulfilled={validations.lowercase} text="Al menos una minúscula (a-z)" />
                    <ValidationItem fulfilled={validations.number} text="Al menos un número (0-9)" />
                    <ValidationItem fulfilled={validations.special} text="Un carácter especial (@ $ ! % * ? &)" />
                </ul>
            </div>
        </div>
    );
};

export default PasswordInput;