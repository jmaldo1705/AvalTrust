// Base de datos de artículos
const articles = {
    1: {
        id: 1,
        title: "Fianzas en la ley",
        author: "Ingrid Alcazar",
        date: "6 Junio 2025",
        image: "image/noticia.png",
        tags: ["Fintech", "Colombia", "Tendencias"],
        content: `
            <p>En AvalTrust aplicamos el principio legal de la fianza para respaldar obligaciones crediticias con avales digitales. Actuamos como fiadores profesionales bajo normas claras, cubriendo pagos incumplidos y activando un fondo de cobertura para su recuperación legal.</p>
            
            <div class="question-section">
                <h3>❓ ¿Qué dice el Código Civil Colombiano sobre la fianza?</h3>
                <div class="answer-box">
                    <h4>📌 Respuesta AvalTrust:</h4>
                    <p>Según el <strong>Artículo 2361 del Código Civil Colombiano</strong>, la fianza es una obligación accesoria mediante la cual una persona (natural o jurídica) se compromete a responder por la deuda de otra ante el acreedor, si esta no cumple con su obligación.</p>
                    
                    <blockquote>
                        <strong>Texto legal:</strong> "La fianza es una obligación accesoria, en virtud de la cual una o más personas responden de una obligación ajena, comprometiéndose para con el acreedor a cumplirla en todo o parte, si el deudor principal no la cumple."
                    </blockquote>
                    
                    <div class="highlight-box">
                        <p><strong>🔍 En AvalTrust</strong>, aplicamos este principio jurídico en un entorno moderno y digital. Como entidad afianzadora, respaldamos obligaciones crediticias con avales digitales emitidos bajo condiciones legales claras, sin intervenir directamente en la aprobación del crédito, pero garantizando el cumplimiento en caso de incumplimiento.</p>
                    </div>
                </div>
            </div>

            <div class="question-section">
                <h3>❓ ¿Puede una empresa dedicarse profesionalmente a ser fiadora?</h3>
                <div class="answer-box">
                    <h4>📌 Respuesta AvalTrust:</h4>
                    <p><strong>Sí.</strong> Aunque la fianza es tradicionalmente una figura civil, la Superintendencia Financiera de Colombia ha aclarado que una persona natural o jurídica puede dedicarse profesionalmente a ser fiadora con fines lucrativos.</p>
                    
                    <div class="reference-box">
                        <p><strong>Referencia:</strong> Concepto 2006004784-002 del 23 de febrero de 2006 – Superfinanciera</p>
                    </div>
                    
                    <p>Cuando una empresa, como AvalTrust, afianza obligaciones de manera habitual y con ánimo de lucro, debe cumplir con los deberes previstos en el <strong>Artículo 19 del Código de Comercio</strong>, entre ellos:</p>
                    <ul>
                        <li>Actuar con diligencia</li>
                        <li>Actuar con buena fe</li>
                        <li>Brindar información veraz</li>
                    </ul>
                </div>
            </div>

            <div class="question-section">
                <h3>❓ ¿Qué cubre una fianza en el contexto financiero?</h3>
                <div class="answer-box">
                    <h4>📌 Respuesta AvalTrust:</h4>
                    <p>La fianza cubre el pago de las obligaciones incumplidas del deudor, como cuotas vencidas de un crédito o valores pendientes en un contrato respaldado.</p>
                    
                    <div class="avaltrust-model">
                        <h4>En el modelo AvalTrust:</h4>
                        <ul>
                            <li><strong>●</strong> Se cubre la pérdida esperada o inesperada de la cartera.</li>
                            <li><strong>●</strong> Se activa el fondo de cobertura, alimentado con los pagos del aval hechos por el deudor.</li>
                            <li><strong>●</strong> Posteriormente, se gestiona la recuperación del crédito mediante un proceso documentado y legal.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h3>Innovación Digital en las Fianzas</h3>
            <p>En AvalTrust hemos modernizado este concepto tradicional mediante tecnología de vanguardia:</p>
            
            <ul>
                <li><strong>Digitalización completa:</strong> Todo el proceso se realiza online, eliminando trámites presenciales</li>
                <li><strong>Fondo de cobertura autosostenible:</strong> Garantizamos la disponibilidad de recursos para cubrir incumplimientos</li>
                <li><strong>Transparencia total:</strong> Reportes en tiempo real y seguimiento detallado de cada operación</li>
                <li><strong>Integración API:</strong> Conexión directa con plataformas fintech y entidades crediticias</li>
            </ul>

            <h3>El Futuro de las Fianzas Digitales</h3>
            <p>El sector fintech colombiano está en constante evolución, y las fianzas digitales representan una oportunidad única para democratizar el acceso al crédito. Con AvalTrust, estamos construyendo un puente entre la tradición jurídica y la innovación tecnológica.</p>
            
            <p>Nuestro compromiso es seguir desarrollando soluciones que beneficien a todo el ecosistema, manteniendo siempre la seguridad jurídica y la transparencia como pilares fundamentales de nuestro servicio.</p>
        `
    }
};

// Función para abrir el modal
function openArticleModal(articleId) {
    console.log('Intentando abrir modal para artículo:', articleId);

    const article = articles[articleId];
    if (!article) {
        console.error('Artículo no encontrado:', articleId);
        return;
    }

    const modalContent = `
        <img src="${article.image}" alt="${article.title}" class="modal-article-image">
        
        <div class="modal-article-meta">
            <span class="modal-article-date">📅 ${article.date}</span>
            <span class="modal-article-author">👤 ${article.author}</span>
        </div>
        
        <h1 class="modal-article-title">${article.title}</h1>
        
        <div class="modal-article-content">
            ${article.content}
        </div>
        
        <div class="modal-article-tags">
            ${article.tags.map(tag => `<a href="#" class="blog-tag">${tag}</a>`).join('')}
        </div>
    `;

    // Verificar que el elemento existe
    const modalContentElement = document.getElementById('modalArticleContent');
    const modalElement = document.getElementById('articleModal');

    if (!modalContentElement || !modalElement) {
        console.error('Elementos del modal no encontrados');
        return;
    }

    modalContentElement.innerHTML = modalContent;
    modalElement.style.display = 'block';
    document.body.style.overflow = 'hidden';

    console.log('Modal abierto exitosamente');
}

// Función para cerrar el modal
function closeArticleModal() {
    const modalElement = document.getElementById('articleModal');
    if (modalElement) {
        modalElement.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('Modal cerrado');
    }
}

// Función para compartir artículo
function shareArticle(platform, title) {
    const url = window.location.href;
    const text = `Lee este artículo: ${title}`;

    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('articleModal');
    if (event.target === modal) {
        closeArticleModal();
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeArticleModal();
    }
});

// Verificar que todo esté cargado correctamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, sistema de modal listo');
    console.log('Artículos disponibles:', Object.keys(articles));
});