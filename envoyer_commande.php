<?php

// L'adresse e-mail où vous voulez recevoir la commande
$destinataire = 'somdaevysteven@gmail.com';
$numero_whatsapp = '+22653025957'; // Numéro de WhatsApp pour référence

// Vérifier que le formulaire a été soumis via la méthode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Récupérer et sécuriser les données du formulaire
    $nom = filter_input(INPUT_POST, 'nom_complet', FILTER_SANITIZE_STRING);
    $adresse = filter_input(INPUT_POST, 'adresse', FILTER_SANITIZE_STRING);
    $email_client = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $instructions = filter_input(INPUT_POST, 'instructions', FILTER_SANITIZE_STRING);
    $panier_json = filter_input(INPUT_POST, 'panier_json', FILTER_SANITIZE_STRING);
    $panier = json_decode($panier_json, true);

    // Vérification des données importantes
    if (empty($nom) || empty($adresse) || empty($email_client) || empty($panier)) {
        echo 'Erreur : Données de formulaire manquantes ou invalides.';
        exit;
    }

    // Sujet de l'e-mail
    $sujet = 'Nouvelle commande de ' . $nom;

    // Construire le corps de l'e-mail et du message WhatsApp/SMS
    $message = "Nouvelle commande enregistrée !\n\n";
    $message .= "Client: " . $nom . "\n";
    $message .= "Adresse: " . $adresse . "\n";
    $message .= "Email: " . $email_client . "\n";
    $message .= "Instructions: " . $instructions . "\n\n";
    $message .= "Contenu du panier:\n";

    $total = 0;
    if (is_array($panier)) {
        foreach ($panier as $item) {
            $sousTotal = $item['prix'] * $item['quantite'];
            $message .= "- " . $item['nom'] . " (x" . $item['quantite'] . ") : " . $sousTotal . " FCFA\n";
            $total += $sousTotal;
        }
    }

    $message .= "\nTotal de la commande : " . $total . " FCFA";

    // En-têtes de l'e-mail, incluant l'adresse de l'expéditeur pour pouvoir y répondre
    $entetes = 'From: ' . $email_client . "\r\n" .
               'Reply-To: ' . $email_client . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    // Envoi de l'e-mail
    if (mail($destinataire, $sujet, $message, $entetes)) {
        // Envoi réussi, vous pouvez maintenant générer un lien WhatsApp
        // Le lien WhatsApp ne peut pas être envoyé automatiquement depuis le serveur,
        // mais il peut être affiché à l'utilisateur pour qu'il l'envoie manuellement.
        // C'est pourquoi la solution JS vue précédemment était la plus adaptée
        // pour l'expérience utilisateur.

        // Dans ce script PHP, nous allons simplement rediriger l'utilisateur
        // vers une page de confirmation, car l'envoi d'e-mail est terminé.
        header('Location: commande_reussie.html');
        exit;
    } else {
        echo 'Erreur lors de l\'envoi de la commande par e-mail.';
    }

} else {
    // Si le script est accédé directement sans soumission de formulaire
    header('Location: acceuil.html');
    exit;
}
?>