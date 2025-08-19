// Calculadora de Cobertura AvalTrust - JavaScript Mejorado
class CalculadoraCobertura {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.validators = new FormValidators();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBar();
        this.initializeTooltips();
        this.setupDynamicFeedback();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('calculadoraForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Real-time validation
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.handleInputChange.bind(this));
        });

        // Terms checkbox
        const termsCheckbox = document.getElementById('acceptTerms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', this.validateTerms.bind(this));
        }
    }

    setupDynamicFeedback() {
        // Valor promedio feedback
        const valorPromedio = document.getElementById('valorPromedio');
        if (valorPromedio) {
            valorPromedio.addEventListener('input', this.updateValorPromedioFeedback.bind(this));
        }

        // Porcentaje default feedback
        const porcentajeDefault = document.getElementById('porcentajeDefault');
        if (porcentajeDefault) {
            porcentajeDefault.addEventListener('input', this.updateRiskIndicator.bind(this));
        }

        // Créditos por mes feedback
        const creditosPorMes = document.getElementById('creditosPorMes');
        if (creditosPorMes) {
            creditosPorMes.addEventListener('input', this.updateVolumeFeedback.bind(this));
        }
    }

    nextStep(step) {
        if (this.validateCurrentStep()) {
            this.showStep(step);
            this.updateProgressBar();

            if (step === 3) {
                this.updateSummary();
                this.calculateEstimation();
            }
        }
    }

    previousStep(step) {
        this.showStep(step);
        this.updateProgressBar();
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show target step
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Update step indicators
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });

        document.querySelectorAll('.step-item').forEach((item, index) => {
            const stepNumber = index + 1;
            if (stepNumber < step) {
                item.classList.add('completed');
            } else if (stepNumber === step) {
                item.classList.add('active');
            }
        });

        this.currentStep = step;

        // Smooth scroll to top of form
        document.querySelector('.calculadora-card').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector('.form-step.active');
        if (!currentStepEl) return false;

        const inputs = currentStepEl.querySelectorAll('.form-control[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
        }

        return isValid;
    }

    validateField(event) {
        const field = event.target;
        const validation = field.dataset.validation;
        const value = field.value.trim();

        if (!validation) return true;

        const rules = validation.split('|');
        let isValid = true;
        let errorMessage = '';

        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            const validationResult = this.validators.validate(ruleName, value, ruleValue);

            if (!validationResult.isValid) {
                isValid = false;
                errorMessage = validationResult.message;
                break;
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const validationEl = field.parentNode.querySelector('.validation-message');

        field.classList.remove('valid', 'invalid');
        field.classList.add(isValid ? 'valid' : 'invalid');

        if (validationEl) {
            validationEl.classList.remove('show', 'error', 'success');

            if (!isValid && message) {
                validationEl.textContent = message;
                validationEl.classList.add('show', 'error');
            } else if (isValid && field.value.trim() !== '') {
                validationEl.textContent = '✓ Campo válido';
                validationEl.classList.add('show', 'success');
            }
        }
    }

    handleInputChange(event) {
        const field = event.target;

        // Clear validation message on input
        const validationEl = field.parentNode.querySelector('.validation-message');
        if (validationEl && field.value.trim() === '') {
            validationEl.classList.remove('show');
            field.classList.remove('valid', 'invalid');
        }
    }

    updateValorPromedioFeedback() {
        const input = document.getElementById('valorPromedio');
        const feedback = document.getElementById('valorPromedioFeedback');

        if (!input || !feedback) return;

        const valor = parseFloat(input.value) || 0;

        feedback.classList.remove('show', 'low', 'medium', 'high');

        if (valor > 0) {
            let category, message;

            if (valor < 1000000) {
                category = 'low';
                message = 'Microcrédito - Ideal para emprendimientos pequeños';
            } else if (valor < 10000000) {
                category = 'medium';
                message = 'Crédito empresarial - Perfecto para PYMES en crecimiento';
            } else {
                category = 'high';
                message = 'Crédito corporativo - Solución para grandes empresas';
            }

            feedback.textContent = message;
            feedback.classList.add('show', category);
        }
    }

    updateRiskIndicator() {
        const input = document.getElementById('porcentajeDefault');
        const indicator = document.getElementById('riskIndicator');

        if (!input || !indicator) return;

        const porcentaje = parseFloat(input.value) || 0;

        indicator.classList.remove('show', 'low-risk', 'medium-risk', 'high-risk');

        if (porcentaje >= 0) {
            let riskLevel, message;

            if (porcentaje <= 3) {
                riskLevel = 'low-risk';
                message = '🟢 Excelente perfil de riesgo - Prima competitiva';
            } else if (porcentaje <= 8) {
                riskLevel = 'medium-risk';
                message = '🟡 Perfil de riesgo moderado - Prima estándar';
            } else {
                riskLevel = 'high-risk';
                message = '🔴 Perfil de alto riesgo - Prima premium';
            }

            indicator.textContent = message;
            indicator.classList.add('show', riskLevel);
        }
    }

    updateVolumeFeedback() {
        const input = document.getElementById('creditosPorMes');
        const feedback = document.getElementById('volumeFeedback');

        if (!input || !feedback) return;

        const volumen = parseInt(input.value) || 0;

        feedback.classList.remove('show', 'low', 'medium', 'high');

        if (volumen > 0) {
            let category, message;

            if (volumen < 50) {
                category = 'low';
                message = 'Volumen bajo - Ideal para empresas iniciando';
            } else if (volumen < 200) {
                category = 'medium';
                message = 'Volumen medio - Perfecto para empresas establecidas';
            } else {
                category = 'high';
                message = 'Alto volumen - Descuentos especiales disponibles';
            }

            feedback.textContent = message;
            feedback.classList.add('show', category);
        }
    }

    updateSummary() {
        const personalData = this.obtenerDatosPersonales();
        const financialData = this.obtenerDatosFinancieros();

        this.updatePersonalSummary(personalData);
        this.updateFinancialSummary(financialData);

        // Store data for submission
        this.formData = { ...personalData, ...financialData };
    }

    updatePersonalSummary(data) {
        const container = document.getElementById('personalSummary');
        if (!container) return;

        const items = [
            { label: 'Nombre', value: data.nombreCompleto },
            { label: 'Cargo', value: this.getCargoLabel(data.cargoDesempena) },
            { label: 'Empresa', value: data.nombreEmpresa },
            { label: 'Correo', value: data.correoEmpresarial },
            { label: 'Teléfono', value: data.celularCorporativo }
        ];

        container.innerHTML = items.map(item => `
            <div class="summary-item">
                <span class="summary-label">${item.label}:</span>
                <span class="summary-value">${item.value || 'No especificado'}</span>
            </div>
        `).join('');
    }

    updateFinancialSummary(data) {
        const container = document.getElementById('financialSummary');
        if (!container) return;

        const items = [
            { label: 'Valor promedio', value: this.formatCurrency(data.valorPromedio) },
            { label: 'Plazo', value: `${data.numeroCuotas} cuotas` },
            { label: 'Tasa de mora', value: `${data.porcentajeDefault}%` },
            { label: 'Volumen mensual', value: `${data.creditosPorMes} créditos` }
        ];

        container.innerHTML = items.map(item => `
            <div class="summary-item">
                <span class="summary-label">${item.label}:</span>
                <span class="summary-value">${item.value || 'No especificado'}</span>
            </div>
        `).join('');
    }

    calculateEstimation() {
        const data = this.formData;

        // Simulación de cálculo (en producción conectaría con API)
        setTimeout(() => {
            const valorPromedio = parseFloat(data.valorPromedio) || 0;
            const creditosPorMes = parseInt(data.creditosPorMes) || 0;
            const porcentajeDefault = parseFloat(data.porcentajeDefault) || 0;

            // Cálculo básico de cobertura
            const coberturaBase = valorPromedio * creditosPorMes;
            const factorRiesgo = 1 + (porcentajeDefault / 100);
            const coberturalEstimada = coberturaBase * factorRiesgo;

            // Cálculo de prima (aproximadamente 2-5% del valor cubierto)
            const tasaPrima = Math.max(2, Math.min(5, porcentajeDefault * 0.8)) / 100;
            const primaEstimada = coberturalEstimada * tasaPrima;

            // Actualizar UI
            document.getElementById('coberturaEstimada').textContent = this.formatCurrency(coberturalEstimada);
            document.getElementById('primaEstimada').textContent = this.formatCurrency(primaEstimada);
        }, 1500);
    }

    validateTerms() {
        const checkbox = document.getElementById('acceptTerms');
        const validation = document.getElementById('termsValidation');

        if (!checkbox || !validation) return;

        validation.classList.remove('show', 'error');

        if (!checkbox.checked) {
            validation.textContent = 'Debes aceptar los términos y condiciones para continuar';
            validation.classList.add('show', 'error');
            return false;
        }

        return true;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateTerms()) {
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulación de envío (en producción conectaría con API)
            await this.simulateSubmission();

            // Show success message
            this.showSuccessMessage();

        } catch (error) {
            this.showToast('Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async simulateSubmission() {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aquí se enviaría la data real a tu API
        console.log('Datos a enviar:', this.formData);

        return { success: true };
    }

    showSuccessMessage() {
        // Hide form
        document.querySelector('.calculadora-card').style.display = 'none';

        // Show success message
        const successEl = document.getElementById('mensajeExito');
        if (successEl) {
            successEl.style.display = 'block';

            // Update confirmation email
            const emailEl = document.getElementById('correoConfirmacion');
            if (emailEl && this.formData.correoEmpresarial) {
                emailEl.textContent = this.formData.correoEmpresarial;
            }

            // Scroll to success message
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add styles if not exists
        if (!document.getElementById('toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    padding: 16px 20px;
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                .toast-error { border-left: 4px solid #ef4444; }
                .toast-success { border-left: 4px solid #10b981; }
                .toast-info { border-left: 4px solid #3b82f6; }
                .toast-content { display: flex; align-items: center; gap: 10px; }
                .toast-message { color: #1f2937; font-weight: 500; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Utility methods
    obtenerDatosPersonales() {
        return {
            nombreCompleto: document.getElementById('nombreCompleto')?.value.trim() || '',
            correoEmpresarial: document.getElementById('correoEmpresarial')?.value.trim() || '',
            celularCorporativo: document.getElementById('celularCorporativo')?.value.trim() || '',
            cargoDesempena: document.getElementById('cargoDesempena')?.value || '',
            nombreEmpresa: document.getElementById('nombreEmpresa')?.value.trim() || ''
        };
    }

    obtenerDatosFinancieros() {
        return {
            valorPromedio: parseFloat(document.getElementById('valorPromedio')?.value) || 0,
            porcentajeDefault: parseFloat(document.getElementById('porcentajeDefault')?.value) || 0,
            numeroCuotas: parseInt(document.getElementById('numeroCuotas')?.value) || 0,
            creditosPorMes: parseInt(document.getElementById('creditosPorMes')?.value) || 0
        };
    }

    getCargoLabel(value) {
        const cargos = {
            'gerente-general': 'Gerente General',
            'director-financiero': 'Director(a) Financiero',
            'gerente-comercial': 'Gerente Comercial',
            'propietario': 'Propietario/Socio',
            'director-credito': 'Director(a) de Crédito',
            'otro': 'Otro cargo directivo'
        };
        return cargos[value] || value;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    initializeTooltips() {
        // Implementar tooltips si es necesario
    }
}

// Form Validators Class
class FormValidators {
    validate(rule, value, ruleValue) {
        switch (rule) {
            case 'required':
                return {
                    isValid: value.length > 0,
                    message: 'Este campo es obligatorio'
                };

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    isValid: emailRegex.test(value),
                    message: 'Ingresa un correo electrónico válido'
                };

            case 'businessEmail':
                const personalDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'live.com'];
                const domain = value.split('@')[1]?.toLowerCase();
                return {
                    isValid: !personalDomains.includes(domain),
                    message: 'Usa un correo empresarial, no personal'
                };

            case 'phone':
                const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
                return {
                    isValid: phoneRegex.test(value),
                    message: 'Ingresa un número de teléfono válido'
                };

            case 'number':
                return {
                    isValid: !isNaN(value) && value !== '',
                    message: 'Ingresa un número válido'
                };

            case 'min':
                const minValue = parseFloat(ruleValue);
                const numValue = parseFloat(value);
                return {
                    isValid: numValue >= minValue,
                    message: `El valor mínimo es ${minValue}`
                };

            case 'max':
                const maxValue = parseFloat(ruleValue);
                const maxNumValue = parseFloat(value);
                return {
                    isValid: maxNumValue <= maxValue,
                    message: `El valor máximo es ${maxValue}`
                };

            case 'minLength':
                const minLength = parseInt(ruleValue);
                return {
                    isValid: value.length >= minLength,
                    message: `Mínimo ${minLength} caracteres`
                };

            default:
                return { isValid: true, message: '' };
        }
    }
}

// Global functions
function nextStep(step) {
    if (window.calculadora) {
        window.calculadora.nextStep(step);
    }
}

function previousStep(step) {
    if (window.calculadora) {
        window.calculadora.previousStep(step);
    }
}

function nuevaEstimacion() {
    // Reset form
    document.getElementById('calculadoraForm').reset();

    // Reset validation states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });

    document.querySelectorAll('.validation-message').forEach(msg => {
        msg.classList.remove('show');
    });

    // Hide success message and show form
    document.getElementById('mensajeExito').style.display = 'none';
    document.querySelector('.calculadora-card').style.display = 'block';

    // Go to first step
    if (window.calculadora) {
        window.calculadora.showStep(1);
    }

    // Scroll to form
    document.querySelector('.calculadora-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.calculadora = new CalculadoraCobertura();
});

// Legacy function for compatibility
function obtenerDatosFormulario() {
    if (window.calculadora) {
        return {
            ...window.calculadora.obtenerDatosPersonales(),
            ...window.calculadora.obtenerDatosFinancieros()
        };
    }
    return {};
}