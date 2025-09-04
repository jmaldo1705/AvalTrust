// Calculadora de Cobertura AvalTrust - JavaScript Mejorado
class CalculadoraCobertura {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.validators = new FormValidators();

        // Configuración del servicio de correo
        this.emailConfig = {
            endpoint: 'https://backend.avaltrust.co/api/mail/send',
            credentials: {
                username: 'comercial@avaltrust.co',
                password: 'beivpwodpbcuszrx'
            }
        };

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
            { label: 'Tasa de impagos', value: `${data.porcentajeDefault}%` },
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
            // Usar el mismo método de cálculo que se envía por correo
            const estimaciones = this.calculateFinalEstimationValues(data);

            console.log("Mostrando en UI:", estimaciones);

            // Actualizar UI con los valores calculados
            document.getElementById('coberturaEstimada').textContent = estimaciones.coberturaEstimadaFormatted;
            document.getElementById('primaEstimada').textContent = estimaciones.primaEstimadaFormatted;
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
            // Enviar email con los datos reales
            await this.sendCalculadoraEmail();

            // Show success message
            this.showSuccessMessage();

        } catch (error) {
            console.error('Error al enviar el email:', error);
            this.showToast('Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');

            // Reset button state on error
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async sendCalculadoraEmail() {
        // Obtener los datos actuales del formulario
        const personalData = this.obtenerDatosPersonales();
        const financialData = this.obtenerDatosFinancieros();
        const allData = { ...personalData, ...financialData };

        // Calcular estimaciones usando el método unificado
        const estimaciones = this.calculateFinalEstimation(allData);

        // Preparar datos adicionales
        const additionalData = {
            fechaHora: new Date().toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            ipCliente: await this.getUserIP(),
            userAgent: navigator.userAgent
        };

        // Generar el HTML del email con todos los datos
        const htmlBody = this.generateEmailHTML({
            ...allData,
            ...estimaciones,
            ...additionalData
        });

        // Preparar el payload para el servicio
        const emailPayload = {
            to: ["comercial@avaltrust.co"],
            subject: `Nueva Solicitud de Calculadora de Cobertura - ${allData.nombreEmpresa || 'Cliente Potencial'}`,
            htmlBody: htmlBody,
            credentials: this.emailConfig.credentials
        };

        // Enviar el email
        const response = await fetch(this.emailConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload)
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Email enviado exitosamente:', result);

        return result;
    }

    calculateFinalEstimation(data) {
        const estimaciones = this.calculateFinalEstimationValues(data);

        return {
            coberturaEstimada: estimaciones.coberturaEstimadaFormatted,
            primaEstimada: estimaciones.primaEstimadaFormatted,
            factorRiesgo: estimaciones.factorRiesgo,
            factorPrima: estimaciones.factorPrima
        };
    }

    calculateFinalEstimationValues(data) {
        const valorPromedio = parseFloat(data.valorPromedio) || 0;
        const creditosPorMes = parseInt(data.creditosPorMes) || 0;
        const porcentajeDefault = parseFloat(data.porcentajeDefault) || 0;

        // Cálculo básico de cobertura
        const coberturaBase = valorPromedio * creditosPorMes;
        const factorRiesgo = porcentajeDefault / 100;

        // Cálculo de prima (2-8% del valor cubierto según el riesgo)
        const primaEstimada = (coberturaBase * factorRiesgo) * 1.19; // Incluye IVA

        console.log("Valores de cálculo unificados:");
        console.log("coberturaBase", coberturaBase);
        console.log("factorRiesgo", factorRiesgo);
        console.log("primaEstimada", primaEstimada);

        return {
            coberturaEstimadaFormatted: this.formatCurrency(coberturaBase),
            primaEstimadaFormatted: this.formatCurrency(primaEstimada),
            coberturaEstimadaRaw: coberturaBase,
            primaEstimadaRaw: primaEstimada,
            factorRiesgo: (factorRiesgo * 100).toFixed(2) + '%',
        };
    }

    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'No disponible';
        }
    }

    generateEmailHTML(data) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Calculadora de Cobertura - AvalTrust</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        .email-container { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        .email-header { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: #fff; padding: 40px 30px; text-align: center; position: relative; }
        .email-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
        .logo { font-size: 32px; font-weight: 800; margin-bottom: 15px; position: relative; z-index: 2; }
        .header-title { font-size: 24px; font-weight: 600; margin-bottom: 8px; position: relative; z-index: 2; }
        .header-subtitle { font-size: 16px; opacity: 0.9; position: relative; z-index: 2; }
        .status-badge { display: inline-block; background: rgba(16,185,129,0.15); color: #10b981; padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin: 20px 0; border: 1px solid rgba(16,185,129,0.3); }
        .email-content { padding: 40px 30px; }
        .greeting { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
        .message-text { color: #6b7280; margin-bottom: 30px; line-height: 1.7; }
        .data-section { background: #f8fafc; border-radius: 15px; padding: 30px; margin: 30px 0; border-left: 5px solid #1e3a8a; }
        .section-title { color: #1f2937; font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .data-grid { display: grid; gap: 15px; }
        .data-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; }
        .data-label { font-weight: 600; color: #374151; font-size: 14px; }
        .data-value { font-weight: 700; color: #1f2937; font-size: 15px; }
        .results-section { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: #fff; border-radius: 15px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden; }
        .results-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none; }
        .results-section .section-title { color: #fff; position: relative; z-index: 2; }
        .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; position: relative; z-index: 2; }
        .result-card { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 25px 20px; text-align: center; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); }
        .result-label { font-size: 14px; opacity: 0.9; margin-bottom: 10px; font-weight: 500; }
        .result-value { font-size: 24px; font-weight: 800; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .cta-section { background: #f8fafc; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0; border: 1px solid #e5e7eb; }
        .cta-title { color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 15px; }
        .cta-text { color: #6b7280; margin-bottom: 25px; line-height: 1.6; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: #fff; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 8px 20px rgba(30,58,138,0.3); }
        .email-footer { background: #1a1a2e; color: #fff; padding: 40px 30px; text-align: center; }
        .footer-logo { font-size: 24px; font-weight: 800; margin-bottom: 15px; color: #fff; }
        .footer-text { color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
        .contact-info { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-bottom: 25px; }
        .contact-item { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.9); font-size: 14px; }
        .footer-note { color: rgba(255,255,255,0.6); font-size: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 20px; }
        @media (max-width: 600px) {
            .email-container { margin: 10px; border-radius: 15px; }
            .email-header, .email-content, .email-footer { padding: 25px 20px; }
            .results-grid { grid-template-columns: 1fr; gap: 15px; }
            .contact-info { flex-direction: column; gap: 15px; }
            .data-item { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">AvalTrust</div>
            <div class="header-title">Nueva Solicitud de Calculadora</div>
            <div class="header-subtitle">Estimación de Cobertura Crediticia</div>
            <div class="status-badge">✅ Solicitud Recibida</div>
        </div>
        
        <div class="email-content">
            <div class="greeting">¡Hola Equipo AvalTrust! 👋</div>
            
            <div class="message-text">
                Se ha recibido una nueva solicitud a través de la calculadora de cobertura en el sitio web. 
                A continuación encontrarás todos los detalles proporcionados por el cliente para generar 
                la estimación personalizada.
            </div>
            
            <div class="data-section">
                <div class="section-title">
                    <span>👤</span> Información del Representante
                </div>
                <div class="data-grid">
                    <div class="data-item">
                        <span class="data-label">Nombre Completo:</span>
                        <span class="data-value">${data.nombreCompleto || 'N/A'}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Cargo:</span>
                        <span class="data-value">${this.getCargoLabel(data.cargoDesempena) || 'N/A'}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Empresa:</span>
                        <span class="data-value">${data.nombreEmpresa || 'N/A'}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Correo Empresarial:</span>
                        <span class="data-value">${data.correoEmpresarial || 'N/A'}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Teléfono Corporativo:</span>
                        <span class="data-value">${data.celularCorporativo || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="data-section">
                <div class="section-title">
                    <span>📊</span> Parámetros Financieros
                </div>
                <div class="data-grid">
                    <div class="data-item">
                        <span class="data-label">Valor Promedio por Crédito:</span>
                        <span class="data-value">${this.formatCurrency(data.valorPromedio || 0)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Número de Cuotas:</span>
                        <span class="data-value">${data.numeroCuotas || 'N/A'} cuotas</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Tasa de Impagos:</span>
                        <span class="data-value">${data.porcentajeDefault || 0}%</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Volumen Mensual:</span>
                        <span class="data-value">${data.creditosPorMes || 'N/A'} créditos</span>
                    </div>
                </div>
            </div>
            
            <div class="results-section">
                <div class="section-title">
                    <span>🎯</span> Estimación Preliminar Generada
                </div>
                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-label">Cobertura Mensual Estimada</div>
                        <div class="result-value">${data.coberturaEstimada || 'N/A'}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Prima Aproximada</div>
                        <div class="result-value">${data.primaEstimada || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="cta-section">
                <div class="cta-title">⚡ Próximos Pasos</div>
                <div class="cta-text">
                    Es momento de contactar al cliente para afinar los detalles y presentar una propuesta 
                    comercial personalizada. El tiempo de respuesta prometido es de menos de 30 minutos.
                </div>
                <a href="mailto:${data.correoEmpresarial || ''}" class="cta-button">
                    📞 Contactar Cliente
                </a>
            </div>
            
            <div class="message-text">
                <strong>📅 Fecha y Hora de Solicitud:</strong> ${data.fechaHora || 'N/A'}<br>
                <strong>🌐 IP del Cliente:</strong> ${data.ipCliente || 'N/A'}<br>
                <strong>💻 User Agent:</strong> ${data.userAgent || 'N/A'}
            </div>
        </div>
        
        <div class="email-footer">
            <div class="footer-logo">AvalTrust</div>
            <div class="footer-text">
                Transformando el acceso al crédito con soluciones innovadoras de aval y garantía.
            </div>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span>📍</span>
                    <span>Calle 70 sur # 43a-13, Edificio Cantoluna, Sabaneta</span>
                </div>
                <div class="contact-item">
                    <span>📱</span>
                    <span>302 765 7434</span>
                </div>
                <div class="contact-item">
                    <span>✉️</span>
                    <span>comercial@avaltrust.co</span>
                </div>
            </div>
            
            <div class="footer-note">
                Este correo fue generado automáticamente por el sistema de calculadora de cobertura de AvalTrust.<br>
                © 2025 AvalTrust. Todos los derechos reservados.
            </div>
        </div>
    </div>
</body>
</html>`;
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