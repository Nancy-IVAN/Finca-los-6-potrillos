(function () {
  const styleId = 'potrillos-chat-styles';
  if (!document.getElementById(styleId)) {
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      .potrillos-chat-toggle{
        position: fixed;
        bottom: 30px;
        right: 30px;
        width:56px;height:56px;border-radius:50%;
        background:#198754;color:#fff;border:0;font-size:1.4rem;
        display:flex;align-items:center;justify-content:center;z-index:99999;
        box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;
      }
      /* ventana más alta y body con mayor max-height */
      #potrillos-chat-window{ position:fixed; right:30px; bottom:110px; width:380px; max-width:calc(100vw - 40px);
        background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.25); z-index:99998; display:none; overflow:hidden;font-family:Segoe UI, Arial, sans-serif;}
      body.dark-mode #potrillos-chat-window{ background:#07101a; color:#e6eef6; }
      #potrillos-chat-header{ padding:12px 14px; display:flex;align-items:center;justify-content:space-between;
        background:linear-gradient(90deg,#0dcaf0,#0bb3d6); color:#fff;}
      /* altura del body aumentada */
      #potrillos-chat-body{ padding:12px; max-height:420px; overflow:auto; background:rgba(0,0,0,0.02);}
      #potrillos-chat-input-area{ display:flex; border-top:1px solid rgba(0,0,0,0.06); background:#f8fafc;}
      body.dark-mode #potrillos-chat-input-area{ background:#07121a; border-top:1px solid rgba(255,255,255,0.04); }
      #potrillos-chat-input{ flex:1;border:0;padding:10px;font-size:.95rem; outline:none;background:transparent; color:inherit;}
      #potrillos-chat-send{ background:#198754;color:#fff;border:0;padding:0 14px;cursor:pointer;}
      .potrillos-msg{ margin-bottom:8px; word-wrap:break-word; }
      .potrillos-msg strong{ margin-right:6px; display:inline-block; }
      .potrillos-link{ color:#0d6efd; text-decoration:underline; cursor:pointer; }
      .potrillos-welcome-msg {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #198754;
        color: #fff;
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99997;
        animation: fadeInUp 0.35s ease forwards;
        font-family: Segoe UI, Arial, sans-serif;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Crear ventana del chat si no existe
    if (!document.getElementById('potrillos-chat-window')) {
      const chatWindow = document.createElement('div');
      chatWindow.id = 'potrillos-chat-window';
      chatWindow.innerHTML = `
        <div id="potrillos-chat-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="img/Imagen1.png" alt="Logo" style="width:36px;height:36px;border-radius:6px;">
            <div>
              <strong>PotrillosBot</strong>
              <div style="font-size:.75rem;opacity:.9">Asistente virtual</div>
            </div>
          </div>
          <button id="potrillos-chat-close" style="background:none;border:0;color:#fff;font-size:1.4rem;cursor:pointer">×</button>
        </div>
        <div id="potrillos-chat-body" role="log" aria-live="polite"></div>
        <div id="potrillos-chat-input-area">
          <input type="text" id="potrillos-chat-input" placeholder="Escribe tu mensaje..." aria-label="mensaje"/>
          <button id="potrillos-chat-send" aria-label="enviar">Enviar</button>
        </div>
      `;
      document.body.appendChild(chatWindow);
    }

    // Referencias DOM (asegurar existencia)
    const chatBtn = document.getElementById('abrirChatBtn');
    const agendarBtn = document.getElementById('agendarBtn');
    const chatWindow = document.getElementById('potrillos-chat-window');
    const chatClose = document.getElementById('potrillos-chat-close');
    const chatBody = document.getElementById('potrillos-chat-body');
    const chatInput = document.getElementById('potrillos-chat-input');
    const chatSend = document.getElementById('potrillos-chat-send');

    if (!chatWindow || !chatBody || !chatInput || !chatSend) return;

    // Helpers
    function appendMessage(sender, text, isHTML = false) {
      const msg = document.createElement('div');
      msg.className = 'potrillos-msg';
      const strong = document.createElement('strong');
      strong.textContent = sender + ':';
      msg.appendChild(strong);
      const content = document.createElement('span');
      if (isHTML) {
        content.innerHTML = ' ' + text;
      } else {
        content.textContent = ' ' + text;
      }
      msg.appendChild(content);
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendWhatsAppLink(phone, message) {
      const a = document.createElement('a');
      a.className = 'potrillos-link';
      a.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Enviar por WhatsApp';
      appendMessage('PotrillosBot', a.outerHTML, true);
    }

    // Open / close
    function openChat() {
      chatWindow.style.display = 'block';
      chatInput.focus();
      if (!chatBody.dataset.started) {
        appendMessage('PotrillosBot', '¡Hola! Soy el asistente virtual de Finca los 6 Potrillos. ¿En qué puedo ayudarte?');
        chatBody.dataset.started = '1';
      }
    }
    function closeChat() {
      chatWindow.style.display = 'none';
    }

    // Eventos
    if (chatBtn) chatBtn.addEventListener('click', openChat);
    if (agendarBtn) agendarBtn.addEventListener('click', (e) => { e.preventDefault(); openChat(); setTimeout(() => { chatInput.value = 'Quiero agendar una visita. Fecha: , Hora: , Personas: , Nombre: '; chatInput.focus(); }, 200); });
    chatClose.addEventListener('click', closeChat);
    document.addEventListener('mousedown', (e) => {
      if (chatWindow.style.display === 'block' && !chatWindow.contains(e.target) && !(chatBtn && chatBtn.contains(e.target))) closeChat();
    });

    // Envío mensajes seguros
    function sendUserMessage() {
      const val = chatInput.value.trim();
      if (!val) return;
      appendMessage('Tú', val);
      chatInput.value = '';
      respondToUser(val.toLowerCase());
    }
    chatSend.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUserMessage(); }
    });

    // Respuestas
    function respondToUser(input) {
      const respuestas = [
        { claves:['hola','buenas','saludos','hey'], respuesta:'¡Hola! Bienvenido a Finca los 6 potrillos. ¿En qué te ayudo?' },
        { claves:['paquete','paquetes','cotizar'], respuesta:'Ofrecemos paquetes para 50 y 100 personas. ¿Quieres que te envíe la cotización por WhatsApp?', whatsapp:true, waMessage:'Hola, quiero cotizar un paquete en Finca los 6 potrillos' },
        { claves:['50','50 personas','50 pax'], respuesta:'Paquete 50 pax: renta 6 hrs, 5 mesas, 50 sillas, asadores, iluminación básica. ¿Cotizar?', whatsapp:true, waMessage:'Hola, quiero cotizar el paquete para 50 personas' },
        { claves:['100','100 personas','100 pax'], respuesta:'Paquete 100 pax: renta 8 hrs, 10 mesas, 100 sillas, iluminación y sonido profesional, coordinador. ¿Cotizar?', whatsapp:true, waMessage:'Hola, quiero cotizar el paquete para 100 personas' },
        { claves:['capilla','capillas'], respuesta:'Contamos con capilla para ceremonias. Puedes pedir fotos o agendar visita.' },
        { claves:['asador','asadores','parrilla'], respuesta:'Disponemos de áreas de asadores y servicio de catering.' },
        { claves:['horario','horarios'], respuesta:'Horario para visitas: Lun-Dom 9:00 - 18:00. Eventos se coordinan según contrato.' },
        { claves:['ubicacion','direccion','donde','maps'], respuesta:'Nos encuentras en Google Maps.', maps:true },
        { claves:['telefono','contacto','numero','tel'], respuesta:'Tel: 427 152 2854' },
        { claves:['reservar','apartado','reservación','agendar','cita','visita'], respuesta:'Para apartar fecha se solicita anticipo del 30%. También puedo ayudarte a agendar aquí o por WhatsApp.', whatsapp:true, waMessage:'Hola, quiero agendar una visita a Finca los 6 Potrillos' },
        { claves:['gracias','muchas gracias'], respuesta:'¡Con gusto! Si necesitas algo más, aquí estoy.' },
        { claves:['cerrar','adios','salir','bye'], respuesta:'Hasta luego 👋', cerrar:true }
      ];

      for (const r of respuestas) {
        if (r.claves.some(k => input.includes(k))) {
          if (r.maps) {
            appendMessage('PotrillosBot', 'Ver ubicación: https://maps.app.goo.gl/dURT7QQNuvYVDsvs6');
            return;
          }
          appendMessage('PotrillosBot', r.respuesta);
          if (r.whatsapp) appendWhatsAppLink('524271522854', r.waMessage || 'Hola');
          if (r.cerrar) setTimeout(closeChat, 800);
          return;
        }
      }

      appendMessage('PotrillosBot', 'No entendí. Puedes preguntar por: paquetes (50/100), capilla, horarios, ubicación o pedir cotización por WhatsApp.');
    }

    // Welcome floating
    function showWelcomeFloating() {
      if (document.querySelector('.potrillos-welcome-msg')) return;
      const welcomeMsg = document.createElement('div');
      welcomeMsg.className = 'potrillos-welcome-msg';
      welcomeMsg.innerHTML = '<strong>PotrillosBot</strong> ¿En algo puedo ayudarte?';
      document.body.appendChild(welcomeMsg);
      setTimeout(() => { welcomeMsg.style.opacity = '0'; welcomeMsg.style.transform = 'translateY(12px)'; setTimeout(() => welcomeMsg.remove(), 350); }, 5000);
    }
    setTimeout(showWelcomeFloating, 800);
    window.addEventListener('load', () => setTimeout(showWelcomeFloating, 800));

    // export open function
    window.abrirPotrillosChat = openChat;

    const btn = document.getElementById('abrirChatBtn');
    const badge = document.getElementById('chatBadge');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('chat-open');
      if (badge) badge.classList.add('hidden');
      try { if (typeof window.abrirPotrillosChat === 'function') window.abrirPotrillosChat(); } catch(e){}
    });
    // función pública para actualizar badge
    window.potrillosSetBadge = (n) => {
      if (!badge) return;
      if (!n || n <= 0) badge.classList.add('hidden');
      else { badge.classList.remove('hidden'); badge.textContent = n > 99 ? '99+' : String(n); }
    };
  });
})();