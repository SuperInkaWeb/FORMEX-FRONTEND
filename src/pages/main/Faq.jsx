import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';


const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all hover:border-formex-orange/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
                <span className="font-bold text-gray-900 text-lg">{question}</span>
                {isOpen ? <ChevronUp className="text-formex-orange" /> : <ChevronDown className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
};

const Faq = () => {
    const faqs = [
        { q: "¿Las clases quedan grabadas?", a: "Sí, absolutamente. Entendemos que a veces no puedes asistir. Todas las sesiones en vivo se graban y se suben a tu aula virtual 24 horas después para que puedas repasarlas cuando quieras." },
        { q: "¿Otorgan certificado al finalizar?", a: "Sí. Al completar el 80% de asistencia y entregar el proyecto final satisfactoriamente, recibes un certificado digital verificado por Formex que puedes añadir a tu LinkedIn." },
        { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex), PayPal y transferencias bancarias locales en moneda nacional." },
        { q: "¿Necesito conocimientos previos?", a: "Depende del curso. Los cursos 'Desde Cero' no requieren experiencia previa. Los niveles 'Intermedio' o 'Avanzado' especifican los requisitos en su descripción." },
        { q: "¿Puedo ganar recompensas mientras aprendo?", a: "Sí. Con nuestro sistema 'Aprende y Gana', acumulas puntos por evaluaciones, completar cursos, etc. Que luego puedes canjear por descuentos y beneficios en futuros cursos."  }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
        

            <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-formex-orange">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Preguntas Frecuentes</h1>
                    <p className="text-gray-500">
                        Resolvemos tus dudas principales. Si no encuentras lo que buscas, contáctanos.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <FaqItem key={idx} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>

      
        </div>
    );
};

export default Faq;