document.addEventListener('DOMContentLoaded', () => {

    /* === 1. MENU MOBILE === */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    /* === 2. CHATBOT === */
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    if (chatInput && chatMessages) {
        function addMessage(sender, message) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${sender}: ${message}`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleUserMessage(message) {
            addMessage('Vous', message);
            const lower = message.toLowerCase();
            let botResponse = "Désolé, je n’ai pas compris. Essayez : horaires, contact, produits, livraison.";

            if (lower.includes('horaire')) botResponse = "Ouverts du mardi au dimanche, de 8h à 19h.";
            else if (lower.includes('contact')) botResponse = "Appelez-nous au 06 12 34 56 78.";
            else if (lower.includes('produits') || lower.includes('menu')) botResponse = "Cupcakes, tartes, macarons… que du bonheur !";
            else if (lower.includes('livraison')) botResponse = "Livraison disponible dans un rayon de 10 km.";
            else if (lower.includes('bonjour') || lower.includes('salut')) botResponse = "Bonjour ! Comment puis-je vous aider ?";

            setTimeout(() => addMessage('Chatbot', botResponse), 1000);
        }

        chatInput.addEventListener('keypress', e => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                handleUserMessage(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }

    /* === 3. PANIER (stocké dans localStorage) === */
    let panier = JSON.parse(localStorage.getItem('panier')) || [];

    window.ajouterAuPanier = function(nom, prix) {
        const existant = panier.find(item => item.nom === nom);
        if (existant) {
            existant.quantite++;
        } else {
            panier.push({ nom, prix, quantite: 1 });
        }
        localStorage.setItem('panier', JSON.stringify(panier));
        alert(`${nom} ajouté au panier.`);
    };

    window.retirerDuPanier = function(nom) {
        panier = panier.filter(item => item.nom !== nom);
        localStorage.setItem('panier', JSON.stringify(panier));
        afficherPanier();
    };

    function afficherPanier() {
        const container = document.getElementById('cart-items');
        const totalDisplay = document.getElementById('cart-total');

        if (container && totalDisplay) {
            container.innerHTML = '';
            let total = 0;

            panier.forEach(item => {
                const ligne = document.createElement('div');
                ligne.innerHTML = `
                    <p>${item.nom} (x${item.quantite}) - ${item.prix * item.quantite} FCFA</p>
                    <button onclick="retirerDuPanier('${item.nom}')">❌</button>
                `;
                container.appendChild(ligne);
                total += item.prix * item.quantite;
            });

            totalDisplay.textContent = `${total} FCFA`;
        }
    }

    if (window.location.pathname.includes('panier.html')) {
        afficherPanier();
    }

    /* === 4. FORMULAIRE DE COMMANDE === */
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            if (panier.length === 0) {
                e.preventDefault();
                alert("Votre panier est vide !");
                return;
            }

            // Ajouter le panier en JSON dans un champ caché
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'panier_json';
            hiddenInput.value = JSON.stringify(panier);
            this.appendChild(hiddenInput);

            // Vider le panier après envoi
            localStorage.removeItem('panier');
        });
    }

});