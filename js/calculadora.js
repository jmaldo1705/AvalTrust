
// Calculadora de Cobertura AvalTrust

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('calculadoraForm');
    const mensajeExito = document.getElementById('mensajeExito');

    // Manejar envío del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarSolicitudCobertura();
    });

    // Función principal para procesar la solicitud
    function procesarSolicitudCobertura() {
        const datos = obtenerDatosFormulario();

        if (!validarDatos(datos)) {
            return;
        }

        // Mostrar estado de carga
        mostrarEstadoCarga();

        // Simular envío de datos (aquí iría la integración real)
        setTimeout(() => {
            enviarDatos(datos);
            mostrarMensajeExito(datos.correoEmpresarial);
            ocultarEstadoCarga();
        }, 2000);
    }

    // Obtener datos del formulario
    function obtenerDatosFormulario() {
        return {
            nombreCompleto: document.getElementById('nombreCompleto').value.trim(),
            correoEmpresarial: document.getElementById('correoEmpresarial').value.trim(),
            celularCorporativo: document.getElementById('celularCorporativo').value.trim(),
            cargoDesempena: document.getElementById('cargoDesempena').value.trim(),
            valorPromedio: parseFloat(document.getElementById('valorPromedio').value) || 0,
            porcentajeDefault: parseFloat(document.getElementById('porcentajeDefault').value) || 0,
            numeroCuotas: parseInt(document.getElementById('numeroCuotas').value) || 0,
            creditosPorMes: parseInt(document.getElementById('creditosPorMes').value) || 0
        };
    }

    // Validar datos del formulario
    function validarDatos(datos) {
        let esValido = true;

        // Limpiar errores previos
        limpiarErrores();

        // Validar nombre completo
        if (!datos.nombreCompleto || datos.nombreCompleto.length < 5) {
            mostrarError('nombreCompleto', 'El nombre completo debe tener al menos 5 caracteres');
            esValido = false;
        }

        // Validar correo empresarial
        if (!validarCorreoEmpresarial(datos.correoEmpresarial)) {
            mostrarError('correoEmpresarial', 'Debe ser un correo empresarial válido (no personal como gmail, hotmail, etc.)');
            esValido = false;
        }

        // Validar celular corporativo
        if (!validarCelular(datos.celularCorporativo)) {
            mostrarError('celularCorporativo', 'Formato de celular inválido. Ejemplo: +57 300 1234567');
            esValido = false;
        }

        // Validar cargo
        if (!datos.cargoDesempena || datos.cargoDesempena.length < 3) {
            mostrarError('cargoDesempena', 'El cargo debe tener al menos 3 caracteres');
            esValido = false;
        }

        // Validar valor promedio
        if (datos.valorPromedio <= 0 || datos.valorPromedio > 100000000) {
            mostrarError('valorPromedio', 'El valor debe estar entre $1 y $100.000.000');
            esValido = false;
        }

        // Validar porcentaje de default
        if (datos.porcentajeDefault < 0 || datos.porcentajeDefault > 100) {
            mostrarError('porcentajeDefault', 'El porcentaje debe estar entre 0% y 100%');
            esValido = false;
        }

        // Validar número de cuotas
        if (datos.numeroCuotas <= 0) {
            mostrarError('numeroCuotas', 'Debe seleccionar el número de cuotas');
            esValido = false;
        }

        // Validar créditos por mes
        if (datos.creditosPorMes <= 0) {
            mostrarError('creditosPorMes', 'Debe ingresar un número válido de créditos por mes');
            esValido = false;
        }

        return esValido;
    }

    // Validar correo empresarial
    function validarCorreoEmpresarial(correo) {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dominiosPersonales = [
            'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com',
            'live.com', 'icloud.com', 'aol.com', 'protonmail.com'
        ];

        if (!regexCorreo.test(correo)) {
            return false;
        }

        const dominio = correo.split('@')[1].toLowerCase();
        return !dominiosPersonales.includes(dominio);
    }

    // Validar celular
    function validarCelular(celular) {
        // Acepta formatos como +57 300 1234567, 300 1234567, 3001234567
        const regexCelular = /^(\+57\s?)?[3][0-9]{2}\s?[0-9]{3}\s?[0-9]{4}$/;
        return regexCelular.test(celular.replace(/\s+/g, ' '));
    }

    // Mostrar error en campo específico
    function mostrarError(campo, mensaje) {
        const input = document.getElementById(campo);
        const grupo = input.closest('.form-group');

        input.classList.add('error');

        // Crear o actualizar mensaje de error
        let errorMsg = grupo.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            grupo.appendChild(errorMsg);
        }
        errorMsg.textContent = mensaje;
        errorMsg.classList.add('show');
    }

    // Limpiar todos los errores
    function limpiarErrores() {
        const inputs = document.querySelectorAll('.form-control');
        const errores = document.querySelectorAll('.error-message');

        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });

        errores.forEach(error => {
            error.classList.remove('show');
        });
    }

    // Mostrar estado de carga
    function mostrarEstadoCarga() {
        const boton = document.querySelector('.btn-calcular');
        boton.classList.add('loading');
        boton.disabled = true;
        boton.innerHTML = '<span class="btn-icon">⏳</span>Procesando solicitud...';
    }

    // Ocultar estado de carga
    function ocultarEstadoCarga() {
        const boton = document.querySelector('.btn-calcular');
        boton.classList.remove('loading');
        boton.disabled = false;
        boton.innerHTML = '<span class="btn-icon">👉</span>Generar estimación ahora';
    }

    // Enviar datos (aquí se integraría con el backend)
    function enviarDatos(datos) {
        // Aquí iría la integración real con el backend
        console.log('Datos a enviar:', datos);

        // Ejemplo de integración con API:
        /*
        fetch('/api/calcular-cobertura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        */

        // Ejemplo de envío por email usando EmailJS o similar:
        /*
        emailjs.send('tu_service_id', 'tu_template_id', {
            to_email: 'contacto@avaltrust.com',
            from_name: datos.nombreCompleto,
            from_email: datos.correoEmpresarial,
            cargo: datos.cargoDesempena,
            celular: datos.celularCorporativo,
            valor_promedio: formatearPesos(datos.valorPromedio),
            porcentaje_default: datos.porcentajeDefault + '%',
            numero_cuotas: datos.numeroCuotas,
            creditos_mes: datos.creditosPorMes
        });
        */
    }

    // Mostrar mensaje de éxito
    function mostrarMensajeExito(correo) {
        // Ocultar formulario
        document.querySelector('.calculadora-card').style.display = 'none';
        document.querySelector('.beneficios-card').style.display = 'none';

        // Mostrar mensaje de éxito
        mensajeExito.style.display = 'block';
        document.getElementById('correoConfirmacion').textContent = correo;

        // Scroll suave al mensaje
        mensajeExito.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Formatear números como pesos colombianos
    function formatearPesos(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }

    // Validación en tiempo real
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.closest('.form-group').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('show');
                }
            }
        });

        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('success');
            }
        });
    });

    // Formateo automático de números
    document.getElementById('valorPromedio').addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '');
        if (valor) {
            // Limitar a 100 millones
            if (parseInt(valor) > 100000000) {
                valor = '100000000';
            }
            this.value = valor;
        }
    });

    document.getElementById('celularCorporativo').addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '');
        if (valor.startsWith('57')) {
            valor = valor.substring(2);
        }
        if (valor.length >= 10) {
            valor = valor.substring(0, 10);
            this.value = '+57 ' + valor.substring(0, 3) + ' ' + valor.substring(3, 6) + ' ' + valor.substring(6);
        }
    });

    // Autocompletado de dominios empresariales comunes
    document.getElementById('correoEmpresarial').addEventListener('input', function() {
        const valor = this.value.toLowerCase();
        if (valor.includes('@')) {
            const partes = valor.split('@');
            if (partes[1] && partes[1].length > 0) {
                // Aquí podrías implementar sugerencias de dominios empresariales
            }
        }
    });
});

// Función para nueva estimación
function nuevaEstimacion() {
    // Mostrar formulario nuevamente
    document.querySelector('.calculadora-card').style.display = 'block';
    document.querySelector('.beneficios-card').style.display = 'block';

    // Ocultar mensaje de éxito
    document.getElementById('mensajeExito').style.display = 'none';

    // Limpiar formulario
    document.getElementById('calculadoraForm').reset();

    // Limpiar errores
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });

    const errores = document.querySelectorAll('.error-message');
    errores.forEach(error => {
        error.classList.remove('show');
    });

    // Scroll al inicio del formulario
    document.querySelector('.calculadora-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Validaciones adicionales para mejora de UX
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir envío de formulario con Enter en inputs de texto
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const siguiente = input.closest('.form-group').nextElementSibling?.querySelector('.form-control');
                if (siguiente) {
                    siguiente.focus();
                }
            }
        });
    });

    // Analytics o tracking (opcional)
    const formulario = document.getElementById('calculadoraForm');
    formulario.addEventListener('submit', function() {
        // Aquí puedes agregar código de tracking como Google Analytics
        // gtag('event', 'form_submit', { form_name: 'calculadora_cobertura' });
    });
});