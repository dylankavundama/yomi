// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Globe,
  Monitor,
  Plus,
  Star,
  LogOut,
  Layers,
  User,
  Bug,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Search,
  Mail,
  Copy,
  Check,
  BarChart2,
  Users,
  FileText,
  Calendar,
  Filter,
  MessageSquare,
  Trash2,
  Sun,
  Moon,
  Code,
  Eye
} from 'lucide-react';
import {
  getStoredUser,
  setStoredUser,
  loginUser,
  logoutUser,
  getProfile,
  createApplication,
  listApplications,
  getApplicationDetails,
  submitTestReview,
  listReviews,
  listUsers,
  trackSendEmails,
  createManualUser,
  submitAppParticipation,
  listAppParticipants,
  getAdminStats,
  submitPlatformFeedback,
  listApprovedFeedbacks,
  listAdminFeedbacks,
  moderatePlatformFeedback,
  getPublicStats,
  updateApplicationStatus,
  trackVisitor
} from './api';

const TRANSLATIONS = {
  fr: {
    // Nav / General
    app_title: "YomiTest",
    nav_logout: "Déconnexion",
    nav_light_mode: "Mode clair",
    nav_dark_mode: "Mode sombre",
    loading: "Chargement...",
    actions: "Actions",
    cancel: "Annuler",
    close: "Fermer",
    finish: "Terminer",
    submit: "Soumettre",
    send: "Envoyer",
    save: "Enregistrer",
    success: "Succès",
    error: "Erreur",
    web: "Web",
    android: "Android",
    ios: "iOS",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    active: "Actif",
    completed: "Terminé",
    unknown: "Inconnu",

    // Landing Page
    hero_badge: "La première communauté de bêta-testeurs",
    hero_title: "Faites tester vos applications par le monde entier.",
    hero_subtitle: "Développeurs : publiez vos projets en 2 minutes. Testeurs : découvrez les nouveautés, soumettez des rapports de bugs et gagnez de l'influence.",
    auth_title: "Rejoindre la plateforme",
    auth_or_mock: "Ou tester rapidement",
    role_tester: "Testeur",
    role_dev: "Dev",
    role_admin: "Admin",
    join_tester_list: "Rejoindre la liste des testeurs",
    join_tester_desc: "Inscrivez-vous simplement avec votre adresse e-mail pour figurer dans notre annuaire et aider les développeurs à tester leurs projets.",
    tester_email_placeholder: "Votre adresse e-mail...",
    join_list_btn: "Rejoindre la liste",
    joining_btn: "Inscription...",
    tester_email_info: "Votre e-mail sera visible dans l'annuaire des testeurs afin que les développeurs puissent vous contacter.",
    recent_apps_title: "Projets récents en cours de test",
    recent_apps_desc: "Découvrez les dernières applications soumises par notre communauté de développeurs.",
    no_public_apps: "Aucune application active en test pour le moment.",
    participate_btn: "Participer",

    // Marketing points
    feature_ux_title: "Améliorez votre UX",
    feature_ux_desc: "Recevez des commentaires constructifs sur l'ergonomie et l'accessibilité de vos applications web et mobiles.",
    feature_bug_title: "Détectez les Bugs",
    feature_bug_desc: "Les testeurs vous signalent les dysfonctionnements ainsi que les informations de leur système d'exploitation.",
    feature_community_title: "Communauté Active",
    feature_community_desc: "Un système de test de pair à pair : testez les applications des autres pour attirer des testeurs sur vos propres projets.",

    // Testimonials
    testimonials_title: "Ce qu'en dit la communauté",
    testimonials_subtitle: "Découvrez les avis laissés par les utilisateurs de la plateforme.",
    no_testimonials: "Aucun avis n'a encore été publié. Soyez le premier !",
    testimonial_published: "Publié le {date}",
    feedback_form_title: "Votre avis nous intéresse !",
    feedback_form_subtitle: "Partagez votre expérience globale sur YomiTest.",
    form_name: "Nom / Pseudo *",
    form_email: "Adresse e-mail *",
    form_rating: "Note globale *",
    form_comment: "Commentaire *",
    form_comment_placeholder: "Votre avis sur la plateforme, l'ergonomie, les fonctionnalités...",
    form_submitting: "Envoi en cours...",
    form_submit_feedback: "Envoyer mon avis",
    feedback_moderation_note: "* Votre avis sera validé par un administrateur avant publication.",

    // Toast & Dialog Alerts
    toast_participate_success: "Merci ! Vous avez été inscrit comme participant pour ce projet.",
    toast_participate_error: "Erreur lors de l'inscription.",
    toast_invite_error: "Erreur d'enregistrement d'invitation:",
    toast_login_success: "Connexion réussie avec Google !",
    toast_login_error: "Échec de l'authentification Google.",
    toast_mock_login_success: "Connecté en mode Démo : {name}",
    toast_mock_login_error: "Erreur de connexion simulée.",
    toast_logout_success: "Déconnecté avec succès.",
    toast_fetch_apps_error: "Erreur lors de la récupération des projets.",
    toast_fetch_users_error: "Erreur lors de la récupération de la liste des testeurs.",
    toast_fetch_admin_stats_error: "Erreur lors de la récupération des statistiques administrateur.",
    toast_fetch_public_feedbacks_error: "Erreur de chargement des avis publics:",
    toast_fetch_admin_feedbacks_error: "Erreur de chargement des avis admin:",
    toast_submit_feedback_success: "Merci ! Votre avis a été soumis et sera visible après modération.",
    toast_submit_feedback_error: "Impossible de soumettre l'avis.",
    toast_moderation_success: "Modération effectuée avec succès.",
    toast_moderation_error: "Erreur de modération.",
    toast_metrics_error: "Erreur enregistrement statistiques d'envoi:",
    toast_app_created_success: "Application soumise aux testeurs !",
    toast_get_testers_error: "Erreur récupération testeurs:",
    toast_app_created_error: "Impossible de publier l'application.",
    toast_tester_created_success: "Testeur enregistré avec succès !",
    toast_tester_created_error: "Erreur de validation ou d'enregistrement.",
    toast_public_tester_success: "Vous avez été inscrit sur la liste des testeurs !",
    toast_public_tester_error: "Erreur lors de l'enregistrement de l'e-mail.",
    toast_load_invitation_error: "Impossible de charger le projet d'invitation : {msg}",
    toast_load_test_error: "Impossible de charger le projet de test : {msg}",
    toast_review_submitted_success: "Rapport de test envoyé ! Merci pour votre contribution.",
    toast_review_submitted_error: "Erreur lors de l'envoi du rapport.",
    toast_load_reviews_error: "Impossible de charger les retours.",
    toast_load_participants_error: "Erreur chargement participants:",

    // Dashboard Header
    welcome_user: "Ravi de vous revoir, {name} 👋",
    dashboard_subtitle: "Gérez vos projets ou testez des applications pour aider la communauté.",
    stats_tests_done: "Tests soumis",
    stats_apps_created: "Apps publiées",

    // Banner Invitations Actives
    active_invitations_title: "Sélection de Test en Cours",
    active_invitations_desc: "Votre adresse e-mail fait partie de la liste des testeurs sélectionnés pour l'application {title} (Développeur : {dev}).",
    launch_test_btn: "Lancer le test",

    // Tabs
    tab_tester: "Espace Testeur ({count})",
    tab_developer: "Espace Développeur ({count})",
    tab_directory: "Trouver des testeurs",
    tab_admin: "Administration",

    // Tester Area
    ready_apps_title: "Applications prêtes à être testées",
    live_update: "Mise à jour en direct",
    no_apps_available: "Aucune application disponible",
    no_apps_available_desc: "Vous avez testé tous les projets en attente ou aucun développeur n'a soumis de projet.",
    app_testers_progress: "{current} / {limit} Testeurs",
    by_dev: "Par {name}",

    // Developer Area
    my_apps_title: "Mes Applications",
    my_apps_subtitle: "Suivez les retours sur vos applications soumises.",
    register_tester_btn: "Enregistrer un testeur",
    submit_project_btn: "Soumettre un projet",
    no_projects_title: "Vous n'avez pas encore soumis de projet",
    no_projects_desc: "Partagez votre application avec nos testeurs pour obtenir des feedbacks de qualité.",
    submit_first_app_btn: "Soumettre ma première application",
    test_progress: "Progression des tests",
    test_reports_count: "{current} / {limit} rapports",
    emails_sent: "Mails Envoyés",
    clicks_count: "Clics enregistrés",
    view_reviews_btn: "Voir les retours ({count})",
    btn_mark_completed: "Marquer comme terminé",
    btn_edit_completion: "Détails de production",
    modal_complete_title: "Terminer la phase de test - {title}",
    modal_complete_desc: "Félicitations pour avoir finalisé vos tests ! Pour clore cette phase, veuillez laisser un avis sur le déroulement et fournir le lien de production de votre application.",
    label_dev_feedback: "Avis du développeur / Retour d'expérience *",
    placeholder_dev_feedback: "Décrivez comment s'est passé le test, ce que vous avez appris, les corrections majeures apportées...",
    label_prod_url: "Lien de la version en production * (ex: App Store, Play Store, site web)",
    placeholder_prod_url: "https://...",
    dev_feedback_title: "Avis du Développeur :",
    prod_link_title: "Version de production :",
    btn_reopen_test: "Réouvrir le test",
    toast_update_status_success: "Statut mis à jour avec succès !",
    btn_view_project: "Détails & Production",

    // Directory
    directory_title: "Trouver des testeurs",
    directory_subtitle: "Découvrez et contactez des testeurs actifs de la communauté pour vos projets.",
    search_placeholder: "Rechercher par nom ou email...",
    no_user_found: "Aucun utilisateur trouvé",
    no_user_found_desc: "Ajustez vos filtres ou essayez une autre recherche.",
    badge_you: "VOUS",
    member_since: "Membre depuis {date}",
    badge_tests_done_plural: "{count} tests effectués",
    badge_tests_done_singular: "{count} test effectué",
    badge_apps_created_plural: "{count} apps publiées",
    badge_apps_created_singular: "{count} app publiée",
    copy_email_title: "Copier l'adresse e-mail",
    contact_tester_btn: "Contacter le testeur",

    // Admin
    admin_tab_stats: "Statistiques",
    admin_tab_moderation: "Modération des avis ({count})",
    admin_title: "Tableau de Bord Administrateur",
    admin_subtitle: "Statistiques de la plateforme et tendances d'activité.",
    period_label: "Période :",
    period_day: "24 Heures",
    period_month: "30 Jours",
    period_year: "12 Mois",
    period_all: "Tout le temps",
    admin_stats_error: "Impossible de charger les statistiques. Veuillez réessayer plus tard.",
    stat_new_users: "Nouveaux Testeurs",
    stat_new_users_sub: "Inscriptions enregistrées",
    stat_new_apps: "Projets Soumis",
    stat_new_apps_sub: "Applications ajoutées",
    stat_new_reviews: "Rapports de Test",
    stat_new_reviews_sub: "Retours d'expérience",
    stat_emails_clicks: "Mails / Clics de test",
    stat_emails_clicks_sub: "Suivi d'invitations actives",
    stat_visitors: "Visiteurs",
    stat_visitors_sub: "Visites uniques",
    btn_apply_filter: "Filtrer",
    btn_reset_filter: "Réinitialiser",
    activity_trends_title: "Tendances de l'activité",
    activity_trends_subtitle: "Visualisez les fluctuations de la plateforme selon la période sélectionnée.",
    activity_users: "Nouveaux Testeurs",
    activity_users_badge: "Inscriptions",
    activity_apps: "Applications publiées",
    activity_apps_badge: "Projets",
    activity_reviews: "Rapports soumis",
    activity_reviews_badge: "Retours",
    activity_visitors: "Visiteurs",
    activity_visitors_badge: "Visites",
    no_activity_data: "Aucune donnée d'activité sur cette période",

    // Admin Moderation
    moderation_title: "Modération des Avis Plateforme",
    moderation_subtitle: "Valisez ou masquez les avis et commentaires soumis par les visiteurs de la page d'accueil.",
    no_feedbacks_moderation: "Aucun avis n'a encore été soumis sur la plateforme.",
    badge_approved_visible: "Approuvé & Visible",
    badge_pending: "En attente",
    feedback_submitted_at: "Soumis le {date}",
    btn_disapprove: "Désapprouver",
    btn_approve: "Approuver",
    btn_delete: "Supprimer",

    // Modal Add App
    modal_app_submitted_title: "Application soumise !",
    modal_app_submitted_desc: "Voici les {count} testeurs recommandés pour votre projet :",
    no_testers_registered: "Aucun autre testeur inscrit pour le moment.",
    no_testers_registered_desc: "Dès qu'un testeur rejoindra la plateforme, il pourra voir votre projet.",
    copied_all_emails: "Toutes les adresses copiées !",
    copy_all_emails_btn: "Copier toutes les adresses e-mail ({count})",
    btn_invite_emails: "Envoyer les invitations",
    modal_add_app_title: "Soumettre une application",
    label_app_title: "Titre de l'application *",
    label_platform: "Plateforme *",
    platform_web: "Web (Site / App)",
    platform_android: "Android (.apk / Play Store)",
    platform_ios: "iOS (TestFlight / App Store)",
    platform_windows: "Windows (Bureau)",
    platform_macos: "macOS (Bureau)",
    platform_linux: "Linux (Bureau)",
    label_tester_limit: "De combien de testeurs avez-vous besoin ? *",
    label_app_url: "Lien de téléchargement ou d'accès *",
    label_description: "Description générale *",
    placeholder_description: "Que fait votre application ? Quel est son but ?",
    label_instructions: "Instructions spécifiques pour le test *",
    placeholder_instructions: "Ex: Inscrivez-vous, ajoutez un article au panier et essayez de faire un paiement fictif. Signalez les bugs d'affichage.",

    // Modal Register Tester
    modal_add_tester_title: "Enregistrer un testeur",
    label_tester_name: "Nom ou Pseudo *",
    label_tester_email: "Adresse e-mail *",
    tester_email_validation_note: "Nous vérifierons la validité réelle du nom de domaine de l'e-mail (enregistrements MX/A).",
    btn_registering: "Enregistrement...",
    btn_register_tester: "Enregistrer le testeur",

    // Modal Submit Review
    modal_test_title: "Rapport de test : {title}",
    dev_instructions_title: "Instructions du Développeur :",
    btn_open_app_test: "Ouvrir l'application à tester",
    label_rating: "Note générale *",
    label_feedback: "Retour d'expérience *",
    placeholder_feedback: "Qu'avez-vous pensé de l'application ? La navigation est-elle simple ? L'interface est-elle plaisante ?",
    label_bugs: "Bugs ou anomalies rencontrés (optionnel)",
    placeholder_bugs: "Ex: Le bouton de validation du profil ne réagit pas sur Firefox. Décalage du texte sur les écrans mobiles.",
    label_system: "Votre système (détecté automatiquement)",
    btn_send_report: "Envoyer le rapport",

    // Modal View Reviews
    modal_reviews_title: "Rapports de test — {title}",
    modal_reviews_subtitle: "Consultez les retours des testeurs.",
    modal_reviews_tab_reviews: "Rapports de test ({count})",
    modal_reviews_tab_participants: "Participants volontaires ({count})",
    no_reviews_title: "Aucun rapport n'a encore été soumis pour cette application.",
    no_reviews_desc: "Les testeurs qualifiés soumettront bientôt leurs retours.",
    bug_reported_title: "Anomalie signalée :",
    no_participants_title: "Aucun participant externe ne s'est encore inscrit pour tester ce projet.",
    no_participants_desc: "Les participants qui cliquent sur \"Participer\" sur la page d'accueil s'afficheront ici.",
    tester_volunteer: "Testeur volontaire",
    btn_send_invite_title: "Envoyer une invitation de test",

    // Modal Participate
    modal_participate_title: "Participer au test : {title}",
    modal_participate_desc: "Pour tester {title}, veuillez inscrire votre e-mail ci-dessous afin de rejoindre la liste des testeurs de la communauté.",
    label_your_email: "Votre adresse e-mail *",
    modal_participate_note: "Le développeur ({name}) pourra vous envoyer une invitation de test.",
    btn_participate_join: "Rejoindre la liste et participer",

    // Email Templates
    email_invite_subject: "Invitation à tester l'application : {title}",
    email_invite_body: "Bonjour {name},\n\nMerci d'avoir manifesté votre intérêt pour tester mon application \"{title}\" !\n\nVous pouvez maintenant y accéder et soumettre votre rapport de test via ce lien unique :\n{link}\n\nMerci pour votre contribution !",
    bulk_email_invite_subject: "Invitation à tester une application sur YomiTest",
    bulk_email_invite_body: "Bonjour,\n\nJe vous invite à tester mon application sur YomiTest !\nVotre retour d'expérience nous aidera énormément à améliorer le produit.\n\nPour commencer à tester et nous faire vos retours, veuillez cliquer sur ce lien unique :\n{link}\n\nMerci pour votre précieuse contribution !",

    // System Notifications
    notif_invitation_title: "YomiTest — Sélectionné pour un test",
    notif_invitation_body: "Vous avez été sélectionné pour tester l'application \"{title}\" de {dev}.",
    notif_new_app_title: "YomiTest — Nouveau projet en test !",
    notif_new_app_body: "L'application \"{title}\" ({platform}) est en ligne. Par {dev}.",

    // Legal / Footer
    footer_rights: "© {year} YomiTest. Tous droits réservés.",
    footer_terms: "Politique d'utilisation",
    footer_privacy: "Confidentialité",

    // Terms Modal
    terms_title: "Politique d'utilisation",
    terms_sec1_title: "1. Acceptation des conditions",
    terms_sec1_body: "En accédant et en utilisant YomiTest, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'avez pas accepté ces termes, veuillez ne pas utiliser la plateforme.",
    terms_sec2_title: "2. Rôle des Utilisateurs",
    terms_sec2_dev: "Vous vous engagez à soumettre des applications fonctionnelles et à ne pas publier de contenus malveillants, offensants ou enfreignant les droits de propriété intellectuelle.",
    terms_sec2_tester: "Vous vous engagez à fournir des commentaires constructifs, honnêtes et impartiaux. La publication de faux rapports de bugs ou de retours inappropriés entraînera la suspension du compte.",
    terms_sec3_title: "3. Propriété Intellectuelle",
    terms_sec3_body: "Les développeurs conservent l'entière propriété intellectuelle de leurs applications soumises. YomiTest n'acquiert aucun droit sur les projets présentés, si ce n'est le droit de les héberger et de les afficher pour les besoins du test.",
    terms_sec4_title: "4. Responsabilité et Garantie",
    terms_sec4_body: "YomiTest est fourni \"en l'état\". Nous ne pouvons garantir que la plateforme fonctionnera sans interruption ou sans erreur. Nous ne sommes pas responsables du contenu des applications tierces partagées par les développeurs.",
    terms_sec5_title: "5. Modification des Conditions",
    terms_sec5_body: "Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment afin de refléter l'évolution de nos services.",

    // Privacy Modal
    privacy_title: "Charte de Confidentialité",
    privacy_sec1_title: "1. Collecte des données",
    privacy_sec1_body: "Nous collectons les données d'identification de base nécessaires au fonctionnement de la plateforme (nom, adresse e-mail, photo de profil) lors de la connexion Google ou de l'inscription volontaire en tant que testeur.",
    privacy_sec2_title: "2. Utilisation des données",
    privacy_sec2_body: "Vos coordonnées sont partagées de façon sécurisée au sein de notre communauté :",
    privacy_sec2_li1: "L'adresse e-mail des testeurs volontaires inscrits est partagée avec les développeurs des projets qu'ils ont choisi de tester, afin de leur transmettre des invitations par e-mail.",
    privacy_sec2_li2: "Les informations sur votre navigateur et votre système d'exploitation sont envoyées aux développeurs lors de la soumission d'un rapport de test pour les aider à diagnostiquer des anomalies.",
    privacy_sec3_title: "3. Protection et Sécurité",
    privacy_sec3_body: "Nous mettons en œuvre des mesures de sécurité techniques pour protéger vos données contre tout accès non autorisé, altération ou divulgation.",
    privacy_sec4_title: "4. Vos Droits (RGPD)",
    privacy_sec4_body: "Conformément aux réglementations sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit ou retirer votre e-mail de l'annuaire, vous pouvez contacter le support ou demander la suppression de votre compte.",
    privacy_sec5_title: "5. Cookies",
    privacy_sec5_body: "Nous utilisons des cookies techniques essentiels pour maintenir votre session utilisateur. Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces basées sur vos visites antérieures sur ce site ou sur d'autres sites. Vous pouvez désactiver la publicité personnalisée dans les paramètres des annonces de votre compte Google, ou en visitant le site www.aboutads.info."
  },
  en: {
    // Nav / General
    app_title: "YomiTest",
    nav_logout: "Logout",
    nav_light_mode: "Light mode",
    nav_dark_mode: "Dark mode",
    loading: "Loading...",
    actions: "Actions",
    cancel: "Cancel",
    close: "Close",
    finish: "Finish",
    submit: "Submit",
    send: "Send",
    save: "Save",
    success: "Success",
    error: "Error",
    web: "Web",
    android: "Android",
    ios: "iOS",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    active: "Active",
    completed: "Completed",
    unknown: "Unknown",

    // Landing Page
    hero_badge: "The first community of beta-testers",
    hero_title: "Get your applications tested by the world.",
    hero_subtitle: "Developers: publish your projects in 2 minutes. Testers: discover what's new, submit bug reports, and gain influence.",
    auth_title: "Join the platform",
    auth_or_mock: "Or test quickly",
    role_tester: "Tester",
    role_dev: "Dev",
    role_admin: "Admin",
    join_tester_list: "Join the testers list",
    join_tester_desc: "Simply register with your email address to be listed in our directory and help developers test their projects.",
    tester_email_placeholder: "Your email address...",
    join_list_btn: "Join the list",
    joining_btn: "Registering...",
    tester_email_info: "Your email will be visible in the testers directory so that developers can contact you.",
    recent_apps_title: "Recent projects under test",
    recent_apps_desc: "Discover the latest applications submitted by our developer community.",
    no_public_apps: "No active application under test at the moment.",
    participate_btn: "Participate",

    // Marketing points
    feature_ux_title: "Improve your UX",
    feature_ux_desc: "Receive constructive feedback on the usability and accessibility of your web and mobile applications.",
    feature_bug_title: "Detect Bugs",
    feature_bug_desc: "Testers report malfunctions along with their operating system information.",
    feature_community_title: "Active Community",
    feature_community_desc: "A peer-to-peer testing system: test others' apps to attract testers to your own projects.",

    // Testimonials
    testimonials_title: "What the community says",
    testimonials_subtitle: "Discover the reviews left by users of the platform.",
    no_testimonials: "No reviews have been published yet. Be the first!",
    testimonial_published: "Published on {date}",
    feedback_form_title: "Your opinion matters!",
    feedback_form_subtitle: "Share your overall experience on YomiTest.",
    form_name: "Name / Username *",
    form_email: "Email Address *",
    form_rating: "Overall Rating *",
    form_comment: "Comment *",
    form_comment_placeholder: "Your thoughts on the platform, usability, features...",
    form_submitting: "Sending...",
    form_submit_feedback: "Send my review",
    feedback_moderation_note: "* Your review will be validated by an administrator before publication.",

    // Toast & Dialog Alerts
    toast_participate_success: "Thank you! You have been registered as a participant for this project.",
    toast_participate_error: "Error during registration.",
    toast_invite_error: "Error saving invitation:",
    toast_login_success: "Logged in successfully with Google!",
    toast_login_error: "Google authentication failed.",
    toast_mock_login_success: "Logged in Demo mode: {name}",
    toast_mock_login_error: "Simulated login error.",
    toast_logout_success: "Logged out successfully.",
    toast_fetch_apps_error: "Error retrieving projects.",
    toast_fetch_users_error: "Error retrieving testers list.",
    toast_fetch_admin_stats_error: "Error retrieving admin statistics.",
    toast_fetch_public_feedbacks_error: "Error loading public reviews:",
    toast_fetch_admin_feedbacks_error: "Error loading admin reviews:",
    toast_submit_feedback_success: "Thank you! Your review has been submitted and will be visible after moderation.",
    toast_submit_feedback_error: "Could not submit the review.",
    toast_moderation_success: "Moderation completed successfully.",
    toast_moderation_error: "Moderation error.",
    toast_metrics_error: "Error saving email sending metrics:",
    toast_app_created_success: "Application submitted to testers!",
    toast_get_testers_error: "Error retrieving testers:",
    toast_app_created_error: "Could not publish the application.",
    toast_tester_created_success: "Tester registered successfully!",
    toast_tester_created_error: "Validation or registration error.",
    toast_public_tester_success: "You have been registered on the testers list!",
    toast_public_tester_error: "Error registering email.",
    toast_load_invitation_error: "Could not load invitation project: {msg}",
    toast_load_test_error: "Could not load test project: {msg}",
    toast_review_submitted_success: "Test report sent! Thank you for your contribution.",
    toast_review_submitted_error: "Error sending the report.",
    toast_load_reviews_error: "Could not load feedback.",
    toast_load_participants_error: "Error loading participants:",

    // Dashboard Header
    welcome_user: "Nice to see you again, {name} 👋",
    dashboard_subtitle: "Manage your projects or test applications to help the community.",
    stats_tests_done: "Tests submitted",
    stats_apps_created: "Apps published",

    // Banner Invitations Actives
    active_invitations_title: "Active Test Selection",
    active_invitations_desc: "Your email address is part of the list of testers selected for the application {title} (Developer: {dev}).",
    launch_test_btn: "Launch test",

    // Tabs
    tab_tester: "Tester Area ({count})",
    tab_developer: "Developer Area ({count})",
    tab_directory: "Find testers",
    tab_admin: "Administration",

    // Tester Area
    ready_apps_title: "Applications ready to be tested",
    live_update: "Live update",
    no_apps_available: "No applications available",
    no_apps_available_desc: "You have tested all pending projects or no developer has submitted a project.",
    app_testers_progress: "{current} / {limit} Testers",
    by_dev: "By {name}",

    // Developer Area
    my_apps_title: "My Applications",
    my_apps_subtitle: "Track feedback on your submitted applications.",
    register_tester_btn: "Register a tester",
    submit_project_btn: "Submit a project",
    no_projects_title: "You haven't submitted any projects yet",
    no_projects_desc: "Share your application with our testers to get quality feedback.",
    submit_first_app_btn: "Submit my first application",
    test_progress: "Test progress",
    test_reports_count: "{current} / {limit} reports",
    emails_sent: "Emails Sent",
    clicks_count: "Clicks tracked",
    view_reviews_btn: "View feedback ({count})",
    btn_mark_completed: "Mark as completed",
    btn_edit_completion: "Production details",
    modal_complete_title: "Complete Testing Phase - {title}",
    modal_complete_desc: "Congratulations on completing your tests! To close this phase, please leave feedback on how the test went and provide the production link of your application.",
    label_dev_feedback: "Developer's Feedback / Review *",
    placeholder_dev_feedback: "Describe how the test went, what you learned, major fixes made...",
    label_prod_url: "Production Version Link * (e.g. App Store, Play Store, website)",
    placeholder_prod_url: "https://...",
    dev_feedback_title: "Developer's Feedback:",
    prod_link_title: "Production Version:",
    btn_reopen_test: "Reopen test",
    toast_update_status_success: "Status updated successfully!",
    btn_view_project: "Details & Production",

    // Directory
    directory_title: "Find testers",
    directory_subtitle: "Discover and contact active community testers for your projects.",
    search_placeholder: "Search by name or email...",
    no_user_found: "No users found",
    no_user_found_desc: "Adjust your filters or try another search.",
    badge_you: "YOU",
    member_since: "Member since {date}",
    badge_tests_done_plural: "{count} tests performed",
    badge_tests_done_singular: "{count} test performed",
    badge_apps_created_plural: "{count} apps published",
    badge_apps_created_singular: "{count} app published",
    copy_email_title: "Copy email address",
    contact_tester_btn: "Contact tester",

    // Admin
    admin_tab_stats: "Statistics",
    admin_tab_moderation: "Review moderation ({count})",
    admin_title: "Admin Dashboard",
    admin_subtitle: "Platform statistics and activity trends.",
    period_label: "Period:",
    period_day: "24 Hours",
    period_month: "30 Days",
    period_year: "12 Months",
    period_all: "All time",
    admin_stats_error: "Could not load statistics. Please try again later.",
    stat_new_users: "New Testers",
    stat_new_users_sub: "Registered signups",
    stat_new_apps: "Submitted Projects",
    stat_new_apps_sub: "Added applications",
    stat_new_reviews: "Test Reports",
    stat_new_reviews_sub: "User feedback",
    stat_emails_clicks: "Emails / Clicks",
    stat_emails_clicks_sub: "Tracked active invitations",
    stat_visitors: "Visitors",
    stat_visitors_sub: "Unique visits",
    btn_apply_filter: "Filter",
    btn_reset_filter: "Reset",
    activity_trends_title: "Activity trends",
    activity_trends_subtitle: "Visualize platform fluctuations based on the selected period.",
    activity_users: "New Testers",
    activity_users_badge: "Signups",
    activity_apps: "Published applications",
    activity_apps_badge: "Projects",
    activity_reviews: "Submitted reports",
    activity_reviews_badge: "Feedback",
    activity_visitors: "Visitors",
    activity_visitors_badge: "Visits",
    no_activity_data: "No activity data for this period",

    // Admin Moderation
    moderation_title: "Platform Review Moderation",
    moderation_subtitle: "Approve or hide reviews and comments submitted by landing page visitors.",
    no_feedbacks_moderation: "No reviews have been submitted on the platform yet.",
    badge_approved_visible: "Approved & Visible",
    badge_pending: "Pending",
    feedback_submitted_at: "Submitted on {date}",
    btn_disapprove: "Disapprove",
    btn_approve: "Approve",
    btn_delete: "Delete",

    // Modal Add App
    modal_app_submitted_title: "Application submitted!",
    modal_app_submitted_desc: "Here are the {count} recommended testers for your project:",
    no_testers_registered: "No other testers registered at the moment.",
    no_testers_registered_desc: "As soon as a tester joins the platform, they will be able to see your project.",
    copied_all_emails: "All addresses copied!",
    copy_all_emails_btn: "Copy all email addresses ({count})",
    btn_invite_emails: "Send invitations",
    modal_add_app_title: "Submit an application",
    label_app_title: "Application Title *",
    label_platform: "Platform *",
    platform_web: "Web (Site / App)",
    platform_android: "Android (.apk / Play Store)",
    platform_ios: "iOS (TestFlight / App Store)",
    platform_windows: "Windows (Desktop)",
    platform_macos: "macOS (Desktop)",
    platform_linux: "Linux (Desktop)",
    label_tester_limit: "How many testers do you need? *",
    label_app_url: "Download or access link *",
    label_description: "General description *",
    placeholder_description: "What does your application do? What is its goal?",
    label_instructions: "Specific testing instructions *",
    placeholder_instructions: "E.g., Sign up, add an item to the cart, and try a mock payment. Report visual issues.",

    // Modal Register Tester
    modal_add_tester_title: "Register a tester",
    label_tester_name: "Name or Username *",
    label_tester_email: "Email Address *",
    tester_email_validation_note: "We will verify the domain name validity of the email (MX/A records).",
    btn_registering: "Registering...",
    btn_register_tester: "Register tester",

    // Modal Submit Review
    modal_test_title: "Test report: {title}",
    dev_instructions_title: "Developer's Instructions:",
    btn_open_app_test: "Open application to test",
    label_rating: "Overall Rating *",
    label_feedback: "Feedback *",
    placeholder_feedback: "What did you think of the application? Is navigation easy? Is the interface pleasing?",
    label_bugs: "Bugs or anomalies encountered (optional)",
    placeholder_bugs: "E.g., The profile submit button doesn't respond on Firefox. Text overlap on mobile screens.",
    label_system: "Your system (automatically detected)",
    btn_send_report: "Send report",

    // Modal View Reviews
    modal_reviews_title: "Test reports — {title}",
    modal_reviews_subtitle: "View tester feedback.",
    modal_reviews_tab_reviews: "Test reports ({count})",
    modal_reviews_tab_participants: "Volunteer participants ({count})",
    no_reviews_title: "No reports have been submitted for this application yet.",
    no_reviews_desc: "Qualified testers will submit their feedback soon.",
    bug_reported_title: "Reported Bug:",
    no_participants_title: "No external participants have registered to test this project yet.",
    no_participants_desc: "Participants clicking \"Participate\" on the landing page will show up here.",
    tester_volunteer: "Volunteer tester",
    btn_send_invite_title: "Send test invitation",

    // Modal Participate
    modal_participate_title: "Participate in test: {title}",
    modal_participate_desc: "To test {title}, please enter your email below to join the community testers list.",
    label_your_email: "Your email address *",
    modal_participate_note: "The developer ({name}) will be able to send you a test invitation.",
    btn_participate_join: "Join list and participate",

    // Email Templates
    email_invite_subject: "Invitation to test the application: {title}",
    email_invite_body: "Hello {name},\n\nThank you for showing interest in testing my application \"{title}\"!\n\nYou can now access it and submit your test report via this unique link:\n{link}\n\nThank you for your contribution !",
    bulk_email_invite_subject: "Invitation to test an application on YomiTest",
    bulk_email_invite_body: "Hello,\n\nI invite you to test my application on YomiTest!\nYour feedback will help us tremendously to improve the product.\n\nTo start testing and give us your feedback, please click on this unique link:\n{link}\n\nThank you for your valuable contribution!",

    // System Notifications
    notif_invitation_title: "YomiTest — Selected for a test",
    notif_invitation_body: "You have been selected to test the application \"{title}\" by {dev}.",
    notif_new_app_title: "YomiTest — New project under test!",
    notif_new_app_body: "The application \"{title}\" ({platform}) is live. By {dev}.",

    // Legal / Footer
    footer_rights: "© {year} YomiTest. All rights reserved.",
    footer_terms: "Terms of Use",
    footer_privacy: "Privacy Policy",

    // Terms Modal
    terms_title: "Terms of Use",
    terms_sec1_title: "1. Acceptance of Terms",
    terms_sec1_body: "By accessing and using YomiTest, you agree to be bound by these general terms and conditions of use. If you do not accept these terms, please do not use the platform.",
    terms_sec2_title: "2. User Roles",
    terms_sec2_dev: "You agree to submit functional applications and not to publish malicious, offensive content or content that infringes intellectual property rights.",
    terms_sec2_tester: "You agree to provide constructive, honest, and unbiased feedback. Publishing fake bug reports or inappropriate feedback will lead to account suspension.",
    terms_sec3_title: "3. Intellectual Property",
    terms_sec3_body: "Developers retain full intellectual property ownership of their submitted applications. YomiTest acquires no rights to the presented projects, except the right to host and display them for testing purposes.",
    terms_sec4_title: "4. Liability and Warranty",
    terms_sec4_body: "YomiTest is provided \"as is\". We cannot guarantee that the platform will operate without interruption or error. We are not responsible for the content of third-party applications shared by developers.",
    terms_sec5_title: "5. Modification of Terms",
    terms_sec5_body: "We reserve the right to modify these terms of use at any time to reflect updates to our services.",

    // Privacy Modal
    privacy_title: "Privacy Policy",
    privacy_sec1_title: "1. Data Collection",
    privacy_sec1_body: "We collect basic identification data necessary for the operation of the platform (name, email address, profile picture) during Google login or voluntary registration as a tester.",
    privacy_sec2_title: "2. Data Usage",
    privacy_sec2_body: "Your contact details are securely shared within our community:",
    privacy_sec2_li1: "The email address of registered volunteer testers is shared with the developers of the projects they chose to test, in order to send them test invitations.",
    privacy_sec2_li2: "Information about your browser and operating system is sent to developers when submitting a test report to help them diagnose bugs.",
    privacy_sec3_title: "3. Protection and Security",
    privacy_sec3_body: "We implement technical security measures to protect your data against unauthorized access, alteration, or disclosure.",
    privacy_sec4_title: "4. Your Rights (GDPR)",
    privacy_sec4_body: "In accordance with personal data protection regulations, you have a right of access, rectification, and deletion of your data. To exercise this right or remove your email from the directory, you can contact support or request account deletion.",
    privacy_sec5_title: "5. Cookies",
    privacy_sec5_body: "We use essential technical cookies to maintain your user session. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings, or by visiting www.aboutads.info."
  }
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('yomitest_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('yomitest_lang') || 'fr');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yomitest_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('yomitest_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key, replacements = {}) => {
    let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
    Object.keys(replacements).forEach(k => {
      text = text.replace(`{${k}}`, replacements[k]);
    });
    return text;
  };

  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('tester'); // 'tester', 'developer', or 'directory'
  const [profileStats, setProfileStats] = useState(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // États de chargement et d'erreur
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAdminStats, setLoadingAdminStats] = useState(false);
  const [apps, setApps] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminPeriod, setAdminPeriod] = useState('all'); // 'day', 'month', 'year', 'all'
  const [adminMonth, setAdminMonth] = useState('');
  const [adminYear, setAdminYear] = useState('');
  const [tempMonth, setTempMonth] = useState('');
  const [tempYear, setTempYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const monthsList = [
    { value: '01', label: lang === 'fr' ? 'Janvier' : 'January' },
    { value: '02', label: lang === 'fr' ? 'Février' : 'February' },
    { value: '03', label: lang === 'fr' ? 'Mars' : 'March' },
    { value: '04', label: lang === 'fr' ? 'Avril' : 'April' },
    { value: '05', label: lang === 'fr' ? 'Mai' : 'May' },
    { value: '06', label: lang === 'fr' ? 'Juin' : 'June' },
    { value: '07', label: lang === 'fr' ? 'Juillet' : 'July' },
    { value: '08', label: lang === 'fr' ? 'Août' : 'August' },
    { value: '09', label: lang === 'fr' ? 'Septembre' : 'September' },
    { value: '10', label: lang === 'fr' ? 'Octobre' : 'October' },
    { value: '11', label: lang === 'fr' ? 'Novembre' : 'November' },
    { value: '12', label: lang === 'fr' ? 'Décembre' : 'December' }
  ];

  const yearsList = ['2024', '2025', '2026', '2027'];

  // États des avis plateforme
  const [publicFeedbacks, setPublicFeedbacks] = useState([]);
  const [loadingPublicFeedbacks, setLoadingPublicFeedbacks] = useState(false);
  const [adminFeedbacks, setAdminFeedbacks] = useState([]);
  const [loadingAdminFeedbacks, setLoadingAdminFeedbacks] = useState(false);
  const [adminSubTab, setAdminSubTab] = useState('stats'); // 'stats' or 'feedbacks'
  const [newFeedbackForm, setNewFeedbackForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(null);
  const [submittedAppTesters, setSubmittedAppTesters] = useState(null);
  const [submittedAppId, setSubmittedAppId] = useState(null);
  const [allEmailsCopied, setAllEmailsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modales
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showReviewDetailsModal, setShowReviewDetailsModal] = useState(false);
  const [showAddTesterModal, setShowAddTesterModal] = useState(false);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCompleteAppModal, setShowCompleteAppModal] = useState(false);
  const [completeAppId, setCompleteAppId] = useState(null);
  const [completeAppName, setCompleteAppName] = useState('');
  const [completeAppForm, setCompleteAppForm] = useState({ devFeedback: '', prodUrl: '' });
  const [submittingCompleteApp, setSubmittingCompleteApp] = useState(false);

  // États formulaires
  const [newTesterForm, setNewTesterForm] = useState({ name: '', email: '' });
  const [submittingTester, setSubmittingTester] = useState(false);
  const [publicTesterEmail, setPublicTesterEmail] = useState('');
  const [submittingPublicTester, setSubmittingPublicTester] = useState(false);
  const [participateEmail, setParticipateEmail] = useState('');
  const [submittingParticipate, setSubmittingParticipate] = useState(false);
  const [participateApp, setParticipateApp] = useState(null);
  const [publicApps, setPublicApps] = useState([]);
  const [publicStats, setPublicStats] = useState({ testers: 0, apps: 0, reviews: 0 });
  const [loadingPublicApps, setLoadingPublicApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('reviews'); // 'reviews' or 'participants'
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Formulaire d'ajout d'application
  const [newAppForm, setNewAppForm] = useState({
    title: '',
    description: '',
    platform: 'Web',
    app_url: '',
    instructions: '',
    tester_limit: 5
  });

  // Formulaire de rapport de test
  const [testReportForm, setTestReportForm] = useState({
    rating: 5,
    feedback: '',
    bugs_found: '',
    device_info: ''
  });

  // Init Google Sign-In
  useEffect(() => {
    /* global google */
    if (window.google && !user && policyAccepted) {
      try {
        google.accounts.id.initialize({
          client_id: "1083856110166-srpq7damuco3fkc2kaioss5p4pcd5qft.apps.googleusercontent.com",
          callback: handleGoogleLogin
        });

        // Timeout to ensure the div is rendered in the DOM
        setTimeout(() => {
          const btnContainer = document.getElementById("google-signin-btn");
          if (btnContainer) {
            google.accounts.id.renderButton(
              btnContainer,
              { theme: "outline", size: "large", text: "signin_with", shape: "pill" }
            );
          }
        }, 50);
      } catch (err) {
        console.warn("Impossible d'initialiser le bouton Google Sign-in :", err);
      }
    }
  }, [user, policyAccepted]);

  // Écouter les invitations par e-mail via l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testAppId = params.get('test_app_id');
    if (testAppId && user) {
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Ouvrir le formulaire de test directement
      openDirectTestApp(testAppId);
    }
  }, [user]);

  // Charger les applications publiques si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      fetchPublicApps();
    }
  }, [user]);

  async function fetchPublicApps() {
    setLoadingPublicApps(true);
    try {
      const data = await listApplications('public_latest');
      if (data.success) {
        setPublicApps(data.apps);
      }

      const statsData = await getPublicStats();
      if (statsData.success) {
        setPublicStats(statsData.stats);
      }
    } catch (err) {
      console.error("Erreur de récupération des applications publiques :", err);
    } finally {
      setLoadingPublicApps(false);
    }
  }

  function handleParticipateClick(app) {
    setParticipateApp(app);
    setParticipateEmail('');
    setShowParticipateModal(true);
  }

  async function handleParticipateSubmit(e) {
    e.preventDefault();
    setSubmittingParticipate(true);
    try {
      const result = await submitAppParticipation({ app_id: participateApp.id, email: participateEmail });
      if (result.success) {
        showToastSuccess(t('toast_participate_success'));
        setShowParticipateModal(false);
        setParticipateEmail('');
        setParticipateApp(null);
      }
    } catch (err) {
      showToastError(err.message || t('toast_participate_error'));
    } finally {
      setSubmittingParticipate(false);
    }
  }

  async function handleInviteParticipant(app, participant) {
    try {
      await trackSendEmails(app.id, 1);
      fetchApps();
    } catch (err) {
      console.error(t('toast_invite_error'), err);
    }

    const email = participant.email;
    const name = participant.name || participant.email;
    const subject = encodeURIComponent(t('email_invite_subject', { title: app.title }));
    const trackingLink = `${window.location.protocol}//${window.location.host}/api/apps/track.php?id=${app.id}`;

    const body = encodeURIComponent(t('email_invite_body', { name, title: app.title, link: trackingLink }));

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  // Charger les données dès que l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      fetchStats();
      if (activeTab === 'directory') {
        fetchUsers();
      } else if (activeTab === 'admin') {
        fetchAdminStats(adminPeriod, adminMonth, adminYear);
        fetchAdminFeedbacks();
      } else {
        fetchApps();
      }
    }
  }, [user, activeTab, adminPeriod, adminMonth, adminYear]);

  // Charger les avis approuvés au démarrage et demander les permissions de notification
  useEffect(() => {
    trackVisitor();
    fetchApprovedFeedbacks();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Déclencher les notifications de navigateur si l'utilisateur est sélectionné pour des tests
  useEffect(() => {
    if (profileStats && profileStats.invitations && profileStats.invitations.length > 0) {
      // Demander l'autorisation des notifications de navigateur
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }

        if (Notification.permission === 'granted') {
          profileStats.invitations.forEach(inv => {
            try {
              new Notification(t('notif_invitation_title'), {
                body: t('notif_invitation_body', { title: inv.app_title, dev: inv.developer_name }),
                icon: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
              });
            } catch (err) {
              console.warn("Erreur d'affichage de la notification système:", err);
            }
          });
        }
      }
    }
  }, [profileStats]);

  // Fermer les messages après 5 secondes
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Callback de connexion Google
  async function handleGoogleLogin(response) {
    try {
      const result = await loginUser({ credential: response.credential });
      if (result.success) {
        setUser(result.user);
        showToastSuccess(t('toast_login_success'));
        setActiveTab('developer');
      }
    } catch (err) {
      showToastError(err.message || t('toast_login_error'));
    }
  }


  // Déconnexion
  function handleLogout() {
    logoutUser();
    setUser(null);
    setProfileStats(null);
    setApps([]);
    setMyApps([]);
    setUsersList([]);
    showToastSuccess(t('toast_logout_success'));
  }

  // Récupérer les stats de profil
  async function fetchStats() {
    setLoadingStats(true);
    try {
      const data = await getProfile();
      if (data.success) {
        setProfileStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }

  // Récupérer la liste des applications
  async function fetchApps() {
    setLoadingApps(true);
    try {
      if (activeTab === 'tester') {
        const data = await listApplications('to_test');
        if (data.success) {
          setApps(data.apps);
          triggerNewAppNotifications(data.apps);
        }
      } else {
        const data = await listApplications('my_apps');
        if (data.success) {
          setMyApps(data.apps);
        }
      }
    } catch (err) {
      showToastError(err.message || t('toast_fetch_apps_error'));
    } finally {
      setLoadingApps(false);
    }
  }

  // Vérifier et incrémenter la limite quotidienne de notifications (max 2/jour)
  function checkAndIncrementDailyNotificationLimit() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const storedDate = localStorage.getItem('yomitest_notif_date');
    let count = parseInt(localStorage.getItem('yomitest_notif_count') || '0');

    if (storedDate !== today) {
      // Nouvelle journée, réinitialiser la date et le compteur
      localStorage.setItem('yomitest_notif_date', today);
      localStorage.setItem('yomitest_notif_count', '0');
      count = 0;
    }

    if (count >= 2) {
      return false; // Limite atteinte
    }

    // Incrémenter le compteur
    localStorage.setItem('yomitest_notif_count', (count + 1).toString());
    return true;
  }

  // Avertir l'utilisateur d'un nouveau projet via notification de navigateur
  function triggerNewAppNotifications(appsList) {
    if (!appsList || appsList.length === 0) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // S'assurer que la permission est accordée
    if (Notification.permission !== 'granted') {
      return;
    }

    // Récupérer l'historique des IDs déjà notifiés
    let notifiedApps = [];
    try {
      notifiedApps = JSON.parse(localStorage.getItem('yomitest_notified_apps') || '[]');
    } catch (e) {
      notifiedApps = [];
    }

    // Premier chargement (pas d'historique en cache) : initialiser en silence
    const isFirstLoad = !localStorage.getItem('yomitest_notified_apps');
    if (isFirstLoad) {
      const initialIds = appsList.map(app => app.id);
      localStorage.setItem('yomitest_notified_apps', JSON.stringify(initialIds));
      return;
    }

    let hasNewNotifications = false;

    appsList.forEach(app => {
      if (!notifiedApps.includes(app.id)) {
        notifiedApps.push(app.id);
        hasNewNotifications = true;

        // Tenter d'afficher si la limite journalière le permet
        if (checkAndIncrementDailyNotificationLimit()) {
          try {
            new Notification(t('notif_new_app_title'), {
              body: t('notif_new_app_body', { title: app.title, platform: app.platform, dev: app.developer_name }),
              icon: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
            });
          } catch (err) {
            console.warn("Erreur d'affichage de la notification de nouveau projet:", err);
          }
        }
      }
    });

    if (hasNewNotifications) {
      localStorage.setItem('yomitest_notified_apps', JSON.stringify(notifiedApps));
    }
  }

  // Récupérer la liste des testeurs/utilisateurs
  async function fetchUsers() {
    setLoadingUsers(true);
    try {
      const data = await listUsers();
      if (data.success) {
        setUsersList(data.users);
      }
    } catch (err) {
      showToastError(err.message || t('toast_fetch_users_error'));
    } finally {
      setLoadingUsers(false);
    }
  }

  // Récupérer les statistiques d'administration
  async function fetchAdminStats(period, month = null, year = null) {
    setLoadingAdminStats(true);
    try {
      const data = await getAdminStats(period, month, year);
      if (data.success) {
        setAdminStats(data);
      }
    } catch (err) {
      showToastError(err.message || t('toast_fetch_admin_stats_error'));
    } finally {
      setLoadingAdminStats(false);
    }
  }

  // Fonctions de filtrage personnalisé pour le tableau de bord admin
  function handlePeriodChange(period) {
    setTempMonth('');
    setTempYear('');
    setAdminMonth('');
    setAdminYear('');
    setAdminPeriod(period);
  }

  function handleApplyCustomFilter(e) {
    e.preventDefault();
    if (tempMonth && tempYear) {
      setAdminMonth(tempMonth);
      setAdminYear(tempYear);
      setAdminPeriod('custom_month');
    } else {
      showToastError(lang === 'fr' ? "Veuillez sélectionner un mois et une année." : "Please select both a month and a year.");
    }
  }

  function handleResetCustomFilter() {
    setTempMonth('');
    setTempYear('');
    setAdminMonth('');
    setAdminYear('');
    setAdminPeriod('all');
  }

  // Récupérer les avis approuvés pour le public
  async function fetchApprovedFeedbacks() {
    setLoadingPublicFeedbacks(true);
    try {
      const data = await listApprovedFeedbacks();
      if (data.success) {
        setPublicFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error(t('toast_fetch_public_feedbacks_error'), err);
    } finally {
      setLoadingPublicFeedbacks(false);
    }
  }

  // Récupérer les avis pour l'administrateur
  async function fetchAdminFeedbacks() {
    setLoadingAdminFeedbacks(true);
    try {
      const data = await listAdminFeedbacks();
      if (data.success) {
        setAdminFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error(t('toast_fetch_admin_feedbacks_error'), err);
    } finally {
      setLoadingAdminFeedbacks(false);
    }
  }

  // Soumettre un avis de plateforme
  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const data = await submitPlatformFeedback(newFeedbackForm);
      if (data.success) {
        showToastSuccess(t('toast_submit_feedback_success'));
        setNewFeedbackForm({ name: '', email: '', rating: 5, comment: '' });
      }
    } catch (err) {
      showToastError(err.message || t('toast_submit_feedback_error'));
    } finally {
      setSubmittingFeedback(false);
    }
  }

  // Modérer un avis de plateforme (Approuver / Désapprouver / Supprimer)
  async function handleModerateFeedback(id, action) {
    try {
      const data = await moderatePlatformFeedback(id, action);
      if (data.success) {
        showToastSuccess(data.message);
        fetchAdminFeedbacks();
        fetchApprovedFeedbacks();
      }
    } catch (err) {
      showToastError(err.message || t('toast_moderation_error'));
    }
  }

  // Copier l'e-mail dans le presse-papier avec retour visuel
  function handleCopyEmail(email, userId) {
    navigator.clipboard.writeText(email);
    setCopiedUserId(userId);
    setTimeout(() => {
      setCopiedUserId(null);
    }, 2000);
  }

  // Copier tous les e-mails des testeurs
  function handleCopyAllEmails(testers) {
    if (!testers || testers.length === 0) return;
    const emails = testers.map(t => t.email).join(', ');
    navigator.clipboard.writeText(emails);
    setAllEmailsCopied(true);
    setTimeout(() => {
      setAllEmailsCopied(false);
    }, 2000);
  }

  // Envoyer l'invitation personnalisée aux testeurs et enregistrer la métrique
  async function handleSendInvitations(appId, testers) {
    if (!testers || testers.length === 0 || !appId) return;

    const count = testers.length;

    // Enregistrer le nombre d'e-mails envoyés sur l'API
    try {
      await trackSendEmails(appId, count);
      fetchApps(); // recharger la liste des apps en arrière-plan pour mettre à jour les statistiques
    } catch (err) {
      console.error(t('toast_metrics_error'), err);
    }

    // Construire le protocole mailto: avec BCC pour ne pas divulguer les adresses entre testeurs
    const bccList = testers.map(t => t.email).join(',');
    const subject = encodeURIComponent(t('bulk_email_invite_subject'));

    // Le lien de suivi pointe vers api/apps/track.php?id=<appId>
    const trackingLink = `${window.location.protocol}//${window.location.host}/api/apps/track.php?id=${appId}`;

    const body = encodeURIComponent(t('bulk_email_invite_body', { link: trackingLink }));

    // Ouvrir le client de messagerie par défaut
    window.location.href = `mailto:?bcc=${bccList}&subject=${subject}&body=${body}`;
  }

  // Fermer la modale d'ajout d'application et réinitialiser
  function handleCloseAddAppModal() {
    setShowAddAppModal(false);
    setSubmittedAppTesters(null);
    setSubmittedAppId(null);
    setNewAppForm({
      title: '',
      description: '',
      platform: 'Web',
      app_url: '',
      instructions: '',
      tester_limit: 5
    });
  }

  // Soumettre une nouvelle application (Développeur)
  async function handleAddAppSubmit(e) {
    e.preventDefault();
    try {
      const result = await createApplication(newAppForm);
      if (result.success) {
        showToastSuccess(t('toast_app_created_success'));
        setSubmittedAppId(result.app_id);

        // Charger les testeurs pour la liste de contact rapide
        try {
          const usersData = await listUsers();
          if (usersData.success) {
            const otherUsers = usersData.users.filter(u => u.id !== user.id);
            const limit = Math.min(newAppForm.tester_limit, otherUsers.length);
            setSubmittedAppTesters(otherUsers.slice(0, limit));
          } else {
            setSubmittedAppTesters([]);
          }
        } catch (usersErr) {
          console.error(t('toast_get_testers_error'), usersErr);
          setSubmittedAppTesters([]);
        }

        fetchApps();
        fetchStats();
      }
    } catch (err) {
      showToastError(err.message || t('toast_app_created_error'));
    }
  }

  // Enregistrer manuellement un testeur externe
  async function handleAddTesterSubmit(e) {
    e.preventDefault();
    setSubmittingTester(true);
    try {
      const result = await createManualUser(newTesterForm);
      if (result.success) {
        showToastSuccess(t('toast_tester_created_success'));
        setShowAddTesterModal(false);
        setNewTesterForm({ name: '', email: '' });
        // Actualiser l'annuaire si on y est
        if (activeTab === 'directory') {
          fetchUsers();
        }
      }
    } catch (err) {
      showToastError(err.message || t('toast_tester_created_error'));
    } finally {
      setSubmittingTester(false);
    }
  }

  // Enregistrer un testeur depuis la page d'accueil (public)
  async function handlePublicAddTesterSubmit(e) {
    e.preventDefault();
    setSubmittingPublicTester(true);
    try {
      const result = await createManualUser({ name: '', email: publicTesterEmail });
      if (result.success) {
        showToastSuccess(t('toast_public_tester_success'));
        setPublicTesterEmail('');
      }
    } catch (err) {
      showToastError(err.message || t('toast_public_tester_error'));
    } finally {
      setSubmittingPublicTester(false);
    }
  }

  // Ouvrir le formulaire de test pour une application
  function handleOpenTestModal(app) {
    setSelectedApp(app);
    // Détecter l'OS et le navigateur par défaut
    const userAgent = navigator.userAgent;
    let os = t('unknown');
    let browser = t('unknown');

    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) os = "macOS";
    else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    else if (userAgent.indexOf("Android") !== -1) os = "Android";
    else if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (userAgent.indexOf("Edg") !== -1) browser = "Edge";

    setTestReportForm({
      rating: 5,
      feedback: '',
      bugs_found: '',
      device_info: `${os} — Navigateur ${browser}`
    });
    setShowTestModal(true);
  }

  // Récupérer les détails d'une application directement et ouvrir le formulaire de test (invitation mail)
  async function openDirectTestApp(appId) {
    try {
      const data = await getApplicationDetails(appId);
      if (data.success) {
        handleOpenTestModal(data.app);
      }
    } catch (err) {
      showToastError(t('toast_load_invitation_error', { msg: err.message }));
    }
  }

  // Lancer un test sélectionné depuis la notification
  async function handleLaunchSelectedTest(appId) {
    try {
      const data = await getApplicationDetails(appId);
      if (data.success) {
        handleOpenTestModal(data.app);
      }
    } catch (err) {
      showToastError(t('toast_load_test_error', { msg: err.message }));
    }
  }

  // Soumettre un rapport de test
  async function handleTestSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        app_id: selectedApp.id,
        ...testReportForm
      };
      const result = await submitTestReview(payload);
      if (result.success) {
        showToastSuccess(t('toast_review_submitted_success'));
        setShowTestModal(false);
        fetchApps();
        fetchStats();
      }
    } catch (err) {
      showToastError(err.message || t('toast_review_submitted_error'));
    }
  }

  // Ouvrir la modale pour clore le test
  function handleOpenCompleteAppModal(app) {
    setCompleteAppId(app.id);
    setCompleteAppName(app.title);
    setCompleteAppForm({
      devFeedback: app.dev_feedback || '',
      prodUrl: app.prod_url || ''
    });
    setShowCompleteAppModal(true);
  }

  // Soumettre le statut et avis/lien de production
  async function handleCompleteAppSubmit(e) {
    e.preventDefault();
    setSubmittingCompleteApp(true);
    try {
      const result = await updateApplicationStatus(
        completeAppId,
        'completed',
        completeAppForm.devFeedback,
        completeAppForm.prodUrl
      );
      if (result.success) {
        showToastSuccess(t('toast_update_status_success'));
        setShowCompleteAppModal(false);
        setCompleteAppForm({ devFeedback: '', prodUrl: '' });
        fetchApps(); // Rafraîchir les applications
      }
    } catch (err) {
      showToastError(err.message || t('error'));
    } finally {
      setSubmittingCompleteApp(false);
    }
  }

  // Réouvrir le test (repasse à 'active')
  async function handleReopenAppTest(app) {
    if (!window.confirm(lang === 'fr' ? "Voulez-vous vraiment réouvrir le test de cette application ?" : "Are you sure you want to reopen testing for this application?")) {
      return;
    }
    try {
      const result = await updateApplicationStatus(app.id, 'active', null, null);
      if (result.success) {
        showToastSuccess(t('toast_update_status_success'));
        fetchApps();
      }
    } catch (err) {
      showToastError(err.message || t('error'));
    }
  }

  // Voir les retours de test d'une application (Développeur)
  async function handleViewReviews(app) {
    setSelectedApp(app);
    setShowReviewDetailsModal(true);
    setLoadingReviews(true);
    setReviewsList([]);
    setParticipantsList([]);
    setActiveModalTab('reviews');

    // Charger les retours
    try {
      const data = await listReviews(app.id);
      if (data.success) {
        setReviewsList(data.reviews);
      }
    } catch (err) {
      showToastError(err.message || t('toast_load_reviews_error'));
    } finally {
      setLoadingReviews(false);
    }

    // Charger les participants
    setLoadingParticipants(true);
    try {
      const data = await listAppParticipants(app.id);
      if (data.success) {
        setParticipantsList(data.participants);
      }
    } catch (err) {
      console.error(t('toast_load_participants_error'), err);
    } finally {
      setLoadingParticipants(false);
    }
  }

  // Toasts de notifications
  function showToastError(msg) {
    setErrorMsg(msg);
  }
  function showToastSuccess(msg) {
    setSuccessMsg(msg);
  }

  // Icone de plateforme
  function getPlatformIcon(platform) {
    switch (platform) {
      case 'Web': return <Globe size={16} />;
      case 'Android': return <Smartphone size={16} />;
      case 'iOS': return <Smartphone size={16} />;
      case 'Windows': return <Monitor size={16} />;
      case 'macOS': return <Monitor size={16} />;
      default: return <Layers size={16} />;
    }
  }

  // Rendu des graphiques de tendances
  const renderChart = (trendData, colorClass) => {
    if (!trendData || trendData.length === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--color-text-dim)' }}>
          <BarChart2 size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <span>{t('no_activity_data')}</span>
        </div>
      );
    }

    const maxVal = Math.max(...trendData.map(d => parseInt(d.count) || 0), 1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', position: 'relative', paddingLeft: '8px', paddingRight: '8px' }}>
          {trendData.map((d, index) => {
            const count = parseInt(d.count) || 0;
            const pct = (count / maxVal) * 100;

            let labelDisplay = d.label;
            if (adminPeriod === 'day') {
              labelDisplay = `${d.label}h`;
            }

            return (
              <div key={index} style={{ flex: 1, minWidth: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }} className="chart-bar-container">
                {/* Tooltip */}
                <div className="chart-tooltip" style={{
                  position: 'absolute',
                  bottom: `calc(${pct}% + 8px)`,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  opacity: 0,
                  transition: 'opacity 0.2s, transform 0.2s',
                  zIndex: 100
                }}>
                  {count} ({labelDisplay})
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: '100%',
                    height: count > 0 ? `${Math.max(pct, 4)}%` : '0%',
                    background: count > 0 ? `var(--color-${colorClass})` : 'transparent',
                    borderRadius: '4px 4px 0 0',
                    cursor: 'pointer'
                  }}
                  className="chart-bar"
                />

                {/* Label */}
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '30px' }}>
                  {labelDisplay}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Toast Alertes */}
      {errorMsg && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          backgroundColor: '#ef4444', color: 'white', padding: '12px 20px',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'modalSlideUp 0.3s ease'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          backgroundColor: '#10b981', color: 'white', padding: '12px 20px',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'modalSlideUp 0.3s ease'
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Barre de navigation */}
      <header className="navbar">
        <div className="navbar-content">
          <div className="logo-group" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <Sparkles className="logo-icon" />
            <span>YomiTest</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Toggles theme & lang */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: user ? '0.5rem' : '0' }}>
              {/* Lang switcher FR | EN */}
              <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setLang('fr')}
                  style={{
                    padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: lang === 'fr' ? 'var(--color-primary)' : 'transparent',
                    color: lang === 'fr' ? '#ffffff' : 'var(--color-text-dim)',
                    transition: 'all 0.15s'
                  }}
                >
                  FR
                </button>
                <button
                  onClick={() => setLang('en')}
                  style={{
                    padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: lang === 'en' ? 'var(--color-primary)' : 'transparent',
                    color: lang === 'en' ? '#ffffff' : 'var(--color-text-dim)',
                    transition: 'all 0.15s'
                  }}
                >
                  EN
                </button>
              </div>

              {/* Theme toggle icon (Sun/Moon) */}
              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
                style={{ padding: '6px', minWidth: 'auto', borderRadius: 'var(--radius-sm)' }}
                title={theme === 'light' ? t('nav_dark_mode') : t('nav_light_mode')}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            {user && (
              <div className="user-menu" style={{ gap: '0.75rem' }}>
                <div className="profile-summary-card" style={{ padding: '4px 12px', gap: '8px', margin: 0, border: 'none' }}>
                  <img src={user.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80"} alt={user.name} className="user-avatar" />
                  <div className="user-info-text">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px' }} title={t('nav_logout')}>
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Corps Principal */}
      <main className="main-content">
        {!user || activeTab === 'home' ? (
          /* SECTION LANDING PAGE ET LOGIN */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5.5rem', padding: '1rem 0 3rem' }}>

            {/* Redesigned Hero & Auth Row */}
            <div className="hero-section" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
              position: 'relative'
            }}>

              {/* Left: Branding & Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'left' }}>
                <div style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary)',
                  fontWeight: 600
                }}>
                  <Sparkles size={14} /> {t('hero_badge')}
                </div>

                <h1 style={{
                  fontSize: '3.25rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  background: theme === 'light'
                    ? 'linear-gradient(135deg, #0f172a 0%, #312e81 30%, #4f46e5 70%, #0891b2 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 30%, #818cf8 70%, #22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t('hero_title')}
                </h1>

                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '540px',
                  margin: 0
                }}>
                  {t('hero_subtitle')}
                </p>

                {/* Key Metrics */}
                <div style={{
                  display: 'flex',
                  gap: '2.5rem',
                  marginTop: '0.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-color)',
                }}>
                  <div>
                    <h5 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{publicStats.testers > 0 ? publicStats.testers : '...'}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {lang === 'fr' ? 'Testeurs Actifs' : 'Active Testers'}
                    </span>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{publicStats.apps > 0 ? publicStats.apps : '...'}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {lang === 'fr' ? 'Apps Testées' : 'Apps Tested'}
                    </span>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{publicStats.reviews > 0 ? publicStats.reviews : '...'}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {lang === 'fr' ? 'Rapports' : 'Reports'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Auth Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  width: '320px',
                  height: '320px',
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 100%)',
                  top: '-40px',
                  right: '-40px',
                  zIndex: 0,
                  filter: 'blur(30px)',
                  pointerEvents: 'none'
                }}></div>

                <div className="card" style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
                      {!user ? t('auth_title') : 'Espace Utilisateur'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {!user ? (lang === 'fr' ? 'Connectez-vous pour commencer votre expérience' : 'Sign in to start your experience') : ''}
                    </p>
                  </div>

                  {/* Google Auth Container */}
                  {!user && (
                    <>
                      {/* Extract of Terms and Conditions */}
                      <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem', textAlign: 'left' }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
                          {lang === 'fr' ? "Conditions d'utilisation" : "Terms of Use"}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.6rem', lineHeight: '1.4' }}>
                          {lang === 'fr'
                            ? "En créant un compte ou en vous connectant à YomiTest, vous acceptez que nous collections et traitions vos données conformément à notre politique. Vous vous engagez également à fournir des retours honnêtes sur les applications testées."
                            : "By creating an account or logging in, you agree to our data collection and processing policies. You also commit to providing honest feedback on tested applications."}
                        </p>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={policyAccepted}
                            onChange={(e) => setPolicyAccepted(e.target.checked)}
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, userSelect: 'none' }}>
                            {lang === 'fr' ? "J'ai lu et j'accepte" : "I have read and accept"}
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem', minHeight: '40px' }}>
                        {policyAccepted ? (
                          <div id="google-signin-btn" style={{ minHeight: '40px' }}></div>
                        ) : (
                          <button className="btn btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={18} />
                            {lang === 'fr' ? "Acceptez pour continuer" : "Accept to continue"}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  {user && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-primary)' }}>
                        {user.picture ? <img src={user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={30} style={{ margin: '15px' }} />}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Bienvenue, {user.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                          Vous êtes connecté.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('tester')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '10px 12px', marginTop: '0.5rem' }}
                      >
                        Retour au Tableau de Bord
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inscription Testeur Section Redesign */}
            <div className="card" style={{
              maxWidth: '700px',
              width: '100%',
              margin: '0 auto',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              border: theme === 'dark' ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid rgba(99, 102, 241, 0.15)',
              background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(23, 37, 84, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%)',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Ambient decoration */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))'
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  color: 'var(--color-accent)',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{t('join_tester_list')}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {lang === 'fr' ? 'Rejoignez les rangs des testeurs de YomiTest' : 'Join the ranks of YomiTest beta testers'}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5, textAlign: 'left', margin: 0 }}>
                {t('join_tester_desc')}
              </p>

              <form onSubmit={handlePublicAddTesterSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder={t('tester_email_placeholder')}
                    value={publicTesterEmail}
                    onChange={e => setPublicTesterEmail(e.target.value)}
                    style={{ flex: 1, minWidth: '260px' }}
                  />
                  <button type="submit" disabled={submittingPublicTester} className="btn btn-accent" style={{ padding: '0 2rem', height: '46px', whiteSpace: 'nowrap' }}>
                    {submittingPublicTester ? t('joining_btn') : t('join_list_btn')}
                  </button>
                </div>
                <small style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', textAlign: 'left', display: 'block' }}>
                  {t('tester_email_info')}
                </small>
              </form>
            </div>

            {/* Dernières applications en cours de test */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', margin: '1rem 0' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2 style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  background: theme === 'light'
                    ? 'linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em'
                }}>
                  {t('recent_apps_title')}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                  {t('recent_apps_desc')}
                </p>
              </div>

              {loadingPublicApps ? (
                <div className="grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  <div className="skeleton skeleton-card" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }}></div>
                  <div className="skeleton skeleton-card" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }}></div>
                  <div className="skeleton skeleton-card" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }}></div>
                </div>
              ) : publicApps.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                  {t('no_public_apps')}
                </div>
              ) : (
                <div className="grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  {publicApps.map(app => (
                    <div key={app.id} className="card" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      padding: '1.75rem',
                      border: '1px solid var(--border-color)',
                      transition: 'transform var(--transition-slow), border-color var(--transition-normal), box-shadow var(--transition-normal)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span className="badge badge-platform" style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          color: 'var(--color-primary)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {getPlatformIcon(app.platform)}
                          <span style={{ marginLeft: '4px' }}>{app.platform}</span>
                        </span>
                        {app.status === 'completed' ? (
                          <span className="badge" style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            color: 'var(--color-success)',
                            fontWeight: 600
                          }}>
                            {t('completed')}
                          </span>
                        ) : (
                          <span className="badge badge-active" style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-accent-glow)',
                            color: 'var(--color-accent)',
                            fontWeight: 600
                          }}>
                            {t('app_testers_progress', { current: app.current_reviews, limit: app.tester_limit })}
                          </span>
                        )}
                      </div>

                      <h4 className="card-title" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                        {app.title}
                      </h4>
                      <p className="card-desc" style={{
                        flex: 1,
                        color: 'var(--color-text-muted)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem',
                        WebkitLineClamp: 4
                      }}>
                        {app.description}
                      </p>

                      {/* Dev Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <img
                          src={app.developer_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50"}
                          alt={app.developer_name}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 500 }}>{t('by_dev', { name: app.developer_name })}</span>
                      </div>

                      {app.status === 'completed' ? (
                        <button
                          onClick={() => handleParticipateClick(app)}
                          className="btn btn-secondary"
                          style={{ width: '100%', padding: '12px', fontWeight: 600, border: '1px solid var(--border-color)' }}
                        >
                          {t('btn_view_project')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleParticipateClick(app)}
                          className="btn btn-accent"
                          style={{ width: '100%', padding: '12px', fontWeight: 600 }}
                        >
                          {t('participate_btn')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features / Marketing */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                  <TrendingUp size={22} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{t('feature_ux_title')}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{t('feature_ux_desc')}</p>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Bug size={22} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{t('feature_bug_title')}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{t('feature_bug_desc')}</p>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                  <ShieldCheck size={22} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{t('feature_community_title')}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{t('feature_community_desc')}</p>
              </div>
            </div>

            {/* Témoignages & Avis Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginTop: '1.5rem', alignItems: 'start' }}>

              {/* Liste des avis approuvés */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    background: theme === 'light'
                      ? 'linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.01em'
                  }}>
                    {t('testimonials_title')}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                    {lang === 'fr' ? 'Découvrez les retours des utilisateurs sur la plateforme.' : 'Read feedback from other users of the platform.'}
                  </p>
                </div>

                {loadingPublicFeedbacks ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                    <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                  </div>
                ) : publicFeedbacks.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid var(--border-color)' }}>
                    <MessageSquare size={26} style={{ opacity: 0.4, color: 'var(--color-primary)' }} />
                    <span>{t('no_testimonials')}</span>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    maxHeight: '460px',
                    overflowY: 'auto',
                    paddingRight: '12px'
                  }}>
                    {publicFeedbacks.map(fb => (
                      <div key={fb.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '1.5rem', margin: 0, border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{fb.name}</span>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={13}
                                className={star <= fb.rating ? 'star-filled' : 'star-empty'}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                          "{fb.comment}"
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', alignSelf: 'flex-end', marginTop: '4px' }}>
                          {t('testimonial_published', { date: new Date(fb.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulaire de soumission d'avis */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content', border: '1px solid var(--border-color)', padding: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{t('feedback_form_title')}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>{t('feedback_form_subtitle')}</p>
                </div>
                <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('form_name')}</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: David L."
                        className="form-control"
                        value={newFeedbackForm.name}
                        onChange={e => setNewFeedbackForm({ ...newFeedbackForm, name: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('form_email')}</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: david@example.com"
                        className="form-control"
                        value={newFeedbackForm.email}
                        onChange={e => setNewFeedbackForm({ ...newFeedbackForm, email: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('form_rating')}</label>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={24}
                          className={`star ${star <= newFeedbackForm.rating ? 'star-filled' : 'star-empty'}`}
                          style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                          onClick={() => setNewFeedbackForm({ ...newFeedbackForm, rating: star })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('form_comment')}</label>
                    <textarea
                      required
                      rows="3"
                      placeholder={t('form_comment_placeholder')}
                      className="form-control"
                      value={newFeedbackForm.comment}
                      onChange={e => setNewFeedbackForm({ ...newFeedbackForm, comment: e.target.value })}
                      style={{ fontSize: '0.85rem', resize: 'vertical', padding: '10px 12px' }}
                    ></textarea>
                  </div>

                  <button type="submit" disabled={submittingFeedback} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
                    {submittingFeedback ? t('form_submitting') : t('form_submit_feedback')}
                  </button>
                  <small style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', textAlign: 'center', display: 'block' }}>
                    {t('feedback_moderation_note')}
                  </small>
                </form>
              </div>

            </div>
          </div>
        ) : (
          /* DASHBOARD PRINCIPAL */
          <div>
            {/* Statistiques Profil & Globales */}
            <div className="dashboard-header">
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('welcome_user', { name: user.name })}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{t('dashboard_subtitle')}</p>
              </div>

              {profileStats && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="stat-box" style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{profileStats.stats.tests_done}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('stats_tests_done')}</span>
                  </div>
                  <div className="stat-box" style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{profileStats.stats.apps_created}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('stats_apps_created')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bannière de notifications d'invitations actives */}
            {profileStats && profileStats.invitations && profileStats.invitations.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)',
                animation: 'modalSlideUp 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  <Sparkles size={16} />
                  <span>{t('active_invitations_title')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {profileStats.invitations.map(inv => (
                    <div key={inv.app_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {lang === 'fr' ? (
                          <>Votre adresse e-mail fait partie de la liste des testeurs sélectionnés pour l'application <strong style={{ color: 'var(--color-text-main)' }}>{inv.app_title}</strong> (Développeur : {inv.developer_name}).</>
                        ) : (
                          <>Your email address is part of the list of testers selected for the application <strong style={{ color: 'var(--color-text-main)' }}>{inv.app_title}</strong> (Developer: {inv.developer_name}).</>
                        )}
                      </div>
                      <button
                        onClick={() => handleLaunchSelectedTest(inv.app_id)}
                        className="btn btn-accent"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        {t('launch_test_btn')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglets */}
            <div className="tabs-container">
              <div
                className={`tab ${activeTab === 'tester' ? 'active' : ''}`}
                onClick={() => setActiveTab('tester')}
              >
                {t('tab_tester', { count: apps.length })}
              </div>
              <div
                className={`tab ${activeTab === 'developer' ? 'active' : ''}`}
                onClick={() => setActiveTab('developer')}
              >
                {t('tab_developer', { count: myApps.length })}
              </div>
              <div
                className={`tab ${activeTab === 'directory' ? 'active' : ''}`}
                onClick={() => setActiveTab('directory')}
              >
                {t('tab_directory')}
              </div>
              {user && user.role === 'admin' && (
                <div
                  className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin')}
                >
                  {t('tab_admin')}
                </div>
              )}
            </div>

            {/* Contenu des Onglets */}
            {activeTab === 'tester' && (
              /* ONGLER TESTEUR */
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('ready_apps_title')}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('live_update')}</span>
                </div>

                {loadingApps ? (
                  <div className="grid-cols-3">
                    <div className="skeleton skeleton-card"></div>
                    <div className="skeleton skeleton-card"></div>
                    <div className="skeleton skeleton-card"></div>
                  </div>
                ) : apps.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)' }}>
                      <Layers size={30} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{t('no_apps_available')}</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{t('no_apps_available_desc')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid-cols-3">
                    {apps.map(app => (
                      <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <span className="badge badge-platform">
                            {getPlatformIcon(app.platform)}
                            {app.platform}
                          </span>
                          <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                            {t('app_testers_progress', { current: app.current_reviews, limit: app.tester_limit })}
                          </span>
                        </div>

                        <h4 className="card-title">{app.title}</h4>
                        <p className="card-desc" style={{ flex: 1 }}>{app.description}</p>

                        {/* Dev Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0.5rem 0 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <img
                            src={app.developer_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50"}
                            alt={app.developer_name}
                            style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                          />
                          <span>Par {app.developer_name}</span>
                        </div>

                        <button
                          onClick={() => handleOpenTestModal(app)}
                          className="btn btn-accent"
                          style={{ width: '100%' }}
                        >
                          {t('launch_test_btn')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'developer' && (
              /* ONGLET DEVELOPPEUR */
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('my_apps_title')}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t('my_apps_subtitle')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowAddTesterModal(true)} className="btn btn-secondary" style={{ gap: '6px' }}>
                      <User size={16} /> {t('register_tester_btn')}
                    </button>
                    <button onClick={() => setShowAddAppModal(true)} className="btn btn-primary">
                      <Plus size={16} /> {t('submit_project_btn')}
                    </button>
                  </div>
                </div>

                {loadingApps ? (
                  <div className="grid-cols-3">
                    <div className="skeleton skeleton-card"></div>
                    <div className="skeleton skeleton-card"></div>
                  </div>
                ) : myApps.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <Sparkles size={30} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{t('no_projects_title')}</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{t('no_projects_desc')}</p>
                    </div>
                    <button onClick={() => setShowAddAppModal(true)} className="btn btn-primary">
                      {t('submit_first_app_btn')}
                    </button>
                  </div>
                ) : (
                  <div className="grid-cols-3">
                    {myApps.map(app => (
                      <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <span className="badge badge-platform">
                            {getPlatformIcon(app.platform)}
                            {app.platform}
                          </span>
                          <span className={app.status === 'active' ? 'badge badge-active' : 'badge badge-completed'}>
                            {app.status === 'active' ? t('active') : t('completed')}
                          </span>
                        </div>

                        <h4 className="card-title">{app.title}</h4>
                        <p className="card-desc" style={{ flex: 1 }}>{app.description}</p>

                        {/* Reviews Stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          <span>{t('test_progress')}</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                            {t('test_reports_count', { current: app.current_reviews, limit: app.tester_limit })}
                          </span>
                        </div>

                        {/* Statistiques d'invitation par mail */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          margin: '0rem 0 1.25rem',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ color: 'var(--color-text-dim)', textTransform: 'uppercase', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>{t('emails_sent')}</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{app.emails_sent || 0}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ color: 'var(--color-text-dim)', textTransform: 'uppercase', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>{t('clicks_count')}</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent)' }}>{app.clicks_count || 0}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewReviews(app)}
                          className="btn btn-secondary"
                          style={{ width: '100%', marginBottom: '8px' }}
                        >
                          <Layers size={14} /> {t('view_reviews_btn', { count: app.current_reviews })}
                        </button>

                        {app.status === 'active' ? (
                          <button
                            onClick={() => handleOpenCompleteAppModal(app)}
                            className="btn btn-accent"
                            style={{
                              width: '100%',
                              gap: '6px',
                              backgroundColor: 'rgba(16, 185, 129, 0.08)',
                              color: 'var(--color-success)',
                              border: '1px solid rgba(16, 185, 129, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckCircle size={14} /> {t('btn_mark_completed')}
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            {app.prod_url && (
                              <a
                                href={app.prod_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-accent"
                                style={{
                                  width: '100%',
                                  fontSize: '0.8rem',
                                  padding: '8px',
                                  gap: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                  color: 'var(--color-primary)',
                                  border: '1px solid rgba(99, 102, 241, 0.15)'
                                }}
                              >
                                <ExternalLink size={14} /> {t('view_prod_app')}
                              </a>
                            )}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleOpenCompleteAppModal(app)}
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '0.75rem', padding: '8px' }}
                              >
                                {t('btn_edit_completion')}
                              </button>
                              <button
                                onClick={() => handleReopenAppTest(app)}
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '0.75rem', padding: '8px', color: 'var(--color-text-muted)' }}
                              >
                                {t('btn_reopen_test')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'directory' && (
              /* ONGLET ANNUAIRE DES TESTEURS */
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('directory_title')}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t('directory_subtitle')}</p>
                  </div>

                  {/* Barre de recherche */}
                  <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                    <input
                      type="text"
                      placeholder={t('search_placeholder')}
                      className="form-control"
                      style={{ paddingLeft: '38px', borderRadius: 'var(--radius-md)' }}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {loadingUsers ? (
                  <div className="grid-cols-3">
                    <div className="skeleton skeleton-card" style={{ height: '180px' }}></div>
                    <div className="skeleton skeleton-card" style={{ height: '180px' }}></div>
                    <div className="skeleton skeleton-card" style={{ height: '180px' }}></div>
                  </div>
                ) : (() => {
                  const filteredUsers = usersList.filter(u =>
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (filteredUsers.length === 0) {
                    return (
                      <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)' }}>
                          <User size={30} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{t('no_user_found')}</h4>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{t('no_user_found_desc')}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid-cols-3">
                      {filteredUsers.map(u => {
                        const isSelf = u.id === user.id;
                        const isCopied = copiedUserId === u.id;
                        return (
                          <div key={u.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', position: 'relative' }}>
                            {/* Header de la carte */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img
                                src={u.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80"}
                                alt={u.name}
                                style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover' }}
                              />
                              <div style={{ flex: 1, overflow: 'hidden' }}>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{u.name}</span>
                                  {isSelf && (
                                    <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{t('badge_you')}</span>
                                  )}
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                                  {t('member_since', { date: new Date(u.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' }) })}
                                </span>
                              </div>
                            </div>

                            {/* Statistiques rapides */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', textTransform: 'none', fontWeight: 500, fontSize: '0.75rem' }}>
                                {u.tests_done > 1 ? t('badge_tests_done_plural', { count: u.tests_done }) : t('badge_tests_done_singular', { count: u.tests_done })}
                              </span>
                              <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.08)', color: 'var(--color-accent)', textTransform: 'none', fontWeight: 500, fontSize: '0.75rem' }}>
                                {u.apps_created > 1 ? t('badge_apps_created_plural', { count: u.apps_created }) : t('badge_apps_created_singular', { count: u.apps_created })}
                              </span>
                            </div>

                            {/* Adresse e-mail avec action rapide */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: 'var(--bg-input)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.85rem',
                              color: 'var(--color-text-muted)',
                              marginTop: 'auto'
                            }}>
                              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginRight: '8px' }}>{u.email}</span>
                              <button
                                onClick={() => handleCopyEmail(u.email, u.id)}
                                className="btn btn-secondary"
                                style={{ padding: '6px', minWidth: 'auto', borderRadius: '4px', border: 'none', backgroundColor: 'rgba(255,255,255,0.03)' }}
                                title={t('copy_email_title')}
                              >
                                {isCopied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                              </button>
                            </div>

                            {/* Actions principales */}
                            {!isSelf && (
                              <a
                                href={`mailto:${u.email}?subject=Invitation à tester mon application sur YomiTest&body=Bonjour ${u.name}, %0D%0A%0D%0AJe vous invite à tester mon application sur YomiTest ! %0D%0A%0D%0ACordialement.`}
                                className="btn btn-accent"
                                style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                              >
                                <Mail size={14} /> {t('contact_tester_btn')}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'admin' && (
              /* ONGLET ADMINISTRATION */
              <div>
                {/* Sous-onglets Admin */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', gap: '1.5rem' }}>
                  <div
                    onClick={() => setAdminSubTab('stats')}
                    style={{
                      padding: '12px 6px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: adminSubTab === 'stats' ? 'var(--color-primary)' : 'var(--color-text-dim)',
                      borderBottom: adminSubTab === 'stats' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <BarChart2 size={16} /> {t('admin_tab_stats')}
                  </div>
                  <div
                    onClick={() => setAdminSubTab('feedbacks')}
                    style={{
                      padding: '12px 6px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: adminSubTab === 'feedbacks' ? 'var(--color-primary)' : 'var(--color-text-dim)',
                      borderBottom: adminSubTab === 'feedbacks' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <MessageSquare size={16} /> {t('admin_tab_moderation', { count: adminFeedbacks.length })}
                  </div>
                </div>

                {adminSubTab === 'stats' ? (
                  /* SOUS-ONGLET STATISTIQUES */
                  <div>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BarChart2 style={{ color: 'var(--color-primary)' }} size={24} />
                          {t('admin_title')}
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t('admin_subtitle')}</p>
                      </div>

                      {/* Filtres */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Filtre de période */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <Filter size={14} style={{ color: 'var(--color-text-dim)' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)', marginRight: '4px' }}>{t('period_label')}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handlePeriodChange('day')}
                              className={`btn ${adminPeriod === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              {t('period_day')}
                            </button>
                            <button
                              onClick={() => handlePeriodChange('month')}
                              className={`btn ${adminPeriod === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              {t('period_month')}
                            </button>
                            <button
                              onClick={() => handlePeriodChange('year')}
                              className={`btn ${adminPeriod === 'year' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              {t('period_year')}
                            </button>
                            <button
                              onClick={() => handlePeriodChange('all')}
                              className={`btn ${adminPeriod === 'all' && !adminMonth ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              {t('period_all')}
                            </button>
                          </div>
                        </div>

                        {/* Filtre personnalisé Mois / Année */}
                        <form onSubmit={handleApplyCustomFilter} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)' }}>
                            {lang === 'fr' ? 'Mois/Année :' : 'Month/Year:'}
                          </span>
                          <select 
                            value={tempMonth} 
                            onChange={e => setTempMonth(e.target.value)} 
                            className="form-control"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', minWidth: '100px', height: 'auto', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                          >
                            <option value="">{lang === 'fr' ? 'Mois' : 'Month'}</option>
                            {monthsList.map(m => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>

                          <select 
                            value={tempYear} 
                            onChange={e => setTempYear(e.target.value)} 
                            className="form-control"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', minWidth: '80px', height: 'auto', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                          >
                            <option value="">{lang === 'fr' ? 'Année' : 'Year'}</option>
                            {yearsList.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>

                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                          >
                            {t('btn_apply_filter')}
                          </button>

                          {(tempMonth || tempYear || adminMonth || adminYear) && (
                            <button 
                              type="button" 
                              onClick={handleResetCustomFilter} 
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              {t('btn_reset_filter')}
                            </button>
                          )}
                        </form>
                      </div>
                    </div>

                    {loadingAdminStats ? (
                      <div>
                        {/* Grille de skeletons KPI */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
                        </div>
                        {/* Skeletons de graphes */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
                          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
                        </div>
                      </div>
                    ) : !adminStats ? (
                      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        <AlertCircle size={32} style={{ marginBottom: '12px', color: 'var(--color-error)', display: 'block', margin: '0 auto' }} />
                        <p>{t('admin_stats_error')}</p>
                      </div>
                    ) : (
                      <div>
                        {/* Grille KPI */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>

                          {/* Card Utilisateurs */}
                          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                              <Users size={22} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                                {adminStats.stats.new_users}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{t('stat_new_users')}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t('stat_new_users_sub')}</span>
                            </div>
                          </div>

                          {/* Card Applications */}
                          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                              <Smartphone size={22} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                                {adminStats.stats.new_apps}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{t('stat_new_apps')}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t('stat_new_apps_sub')}</span>
                            </div>
                          </div>

                          {/* Card Rapports */}
                          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                              <FileText size={22} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                                {adminStats.stats.new_reviews}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{t('stat_new_reviews')}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t('stat_new_reviews_sub')}</span>
                            </div>
                          </div>

                          {/* Card Invitations & Clics */}
                          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(217, 119, 6, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
                              <Mail size={20} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                                {adminStats.stats.emails_sent} <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>/</span> {adminStats.stats.clicks_count}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{t('stat_emails_clicks')}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t('stat_emails_clicks_sub')}</span>
                            </div>
                          </div>

                          {/* Card Visiteurs */}
                          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                              <Eye size={22} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                                {adminStats.stats.visitors || 0}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{t('stat_visitors')}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t('stat_visitors_sub')}</span>
                            </div>
                          </div>

                        </div>

                        {/* Titre Graphiques */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                            {t('activity_trends_title')}
                          </h4>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t('activity_trends_subtitle')}</p>
                        </div>

                        {/* Grille de graphiques de tendances */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                          {/* Trend 1: Utilisateurs */}
                          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t('activity_users')}</span>
                              <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', color: 'var(--color-primary)', textTransform: 'none' }}>{t('activity_users_badge')}</span>
                            </div>
                            {renderChart(adminStats.trends.users, "primary")}
                          </div>

                          {/* Trend 2: Applications */}
                          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t('activity_apps')}</span>
                              <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.08)', color: 'var(--color-accent)', textTransform: 'none' }}>{t('activity_apps_badge')}</span>
                            </div>
                            {renderChart(adminStats.trends.apps, "accent")}
                          </div>

                          {/* Trend 3: Rapports */}
                          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t('activity_reviews')}</span>
                              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', textTransform: 'none' }}>{t('activity_reviews_badge')}</span>
                            </div>
                            {renderChart(adminStats.trends.reviews, "success")}
                          </div>

                          {/* Trend 4: Visiteurs */}
                          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t('activity_visitors')}</span>
                              <span className="badge" style={{ backgroundColor: 'rgba(217, 119, 6, 0.08)', color: 'var(--color-warning)', textTransform: 'none' }}>{t('activity_visitors_badge')}</span>
                            </div>
                            {renderChart(adminStats.trends.visitors, "warning")}
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* SOUS-ONGLET MODÉRATION DES AVIS */
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare style={{ color: 'var(--color-primary)' }} size={24} />
                        {t('moderation_title')}
                      </h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t('moderation_subtitle')}</p>
                    </div>

                    {loadingAdminFeedbacks ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }}></div>
                        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }}></div>
                      </div>
                    ) : adminFeedbacks.length === 0 ? (
                      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
                        <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.5, display: 'block', margin: '0 auto' }} />
                        <p>{t('no_feedbacks_moderation')}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {adminFeedbacks.map(fb => (
                          <div key={fb.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', margin: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>{fb.name}</span>
                                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>({fb.email})</span>

                                  {/* Badge de statut */}
                                  {fb.is_approved ? (
                                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', textTransform: 'none', fontWeight: 600 }}>
                                      {t('badge_approved_visible')}
                                    </span>
                                  ) : (
                                    <span className="badge" style={{ backgroundColor: 'rgba(217, 119, 6, 0.08)', color: 'var(--color-warning)', textTransform: 'none', fontWeight: 600 }}>
                                      {t('badge_pending')}
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px', display: 'block' }}>
                                  {t('feedback_submitted_at', { date: new Date(fb.created_at).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') })}
                                </span>
                              </div>

                              {/* Note Etoiles */}
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    size={14}
                                    className={star <= fb.rating ? 'star-filled' : 'star-empty'}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Commentaire */}
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.5', backgroundColor: 'rgba(0, 0, 0, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', margin: 0, fontStyle: 'italic' }}>
                              "{fb.comment}"
                            </p>

                            {/* Boutons d'actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                              {fb.is_approved ? (
                                <button
                                  onClick={() => handleModerateFeedback(fb.id, 'disapprove')}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
                                >
                                  {t('btn_disapprove')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleModerateFeedback(fb.id, 'approve')}
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px', backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                                >
                                  {t('btn_approve')}
                                </button>
                              )}

                              <button
                                onClick={() => handleModerateFeedback(fb.id, 'delete')}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px', color: 'var(--color-error)', borderColor: 'rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}
                              >
                                <Trash2 size={12} /> {t('btn_delete')}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALE COMPLETION APPLICATION */}
      {showCompleteAppModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                {t('modal_complete_title', { title: completeAppName })}
              </h3>
              <button
                onClick={() => setShowCompleteAppModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCompleteAppSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {t('modal_complete_desc')}
                </p>

                {/* Avis / Feedback */}
                <div className="form-group">
                  <label className="form-label">{t('label_dev_feedback')}</label>
                  <textarea
                    required
                    className="form-control"
                    rows="4"
                    placeholder={t('placeholder_dev_feedback')}
                    value={completeAppForm.devFeedback}
                    onChange={e => setCompleteAppForm({ ...completeAppForm, devFeedback: e.target.value })}
                  ></textarea>
                </div>

                {/* Lien Production */}
                <div className="form-group">
                  <label className="form-label">{t('label_prod_url')}</label>
                  <input
                    type="url"
                    required
                    className="form-control"
                    placeholder={t('placeholder_prod_url')}
                    value={completeAppForm.prodUrl}
                    onChange={e => setCompleteAppForm({ ...completeAppForm, prodUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCompleteAppModal(false)}
                  className="btn btn-secondary"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingCompleteApp}
                  className="btn btn-primary"
                >
                  {submittingCompleteApp ? t('loading') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 1 : FORMULAIRE DE SOUMISSION D'APPLICATION */}
      {showAddAppModal && (
        <div className="modal-overlay">
          {submittedAppTesters !== null ? (
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={20} /> {t('modal_app_submitted_title')}
                  </h3>
                  <button onClick={handleCloseAddAppModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>✕</button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Voici les {submittedAppTesters.length} testeurs recommandés pour votre projet :
                </p>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                {submittedAppTesters.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    <p>{t('no_testers_registered')}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>{t('no_testers_registered_desc')}</p>
                  </div>
                ) : (
                  <>
                    {/* Bulk Copy button */}
                    <button
                      onClick={() => handleCopyAllEmails(submittedAppTesters)}
                      className="btn btn-secondary"
                      style={{ width: '100%', gap: '8px', fontSize: '0.85rem', padding: '10px' }}
                    >
                      {allEmailsCopied ? (
                        <>
                          <Check size={16} style={{ color: 'var(--color-success)' }} />
                          {t('copied_all_emails')}
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          {t('copy_all_emails_btn', { count: submittedAppTesters.length })}
                        </>
                      )}
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                      {submittedAppTesters.map(t => {
                        const isCopied = copiedUserId === t.id;
                        return (
                          <div key={t.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.9rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                              <img
                                src={t.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50"}
                                alt={t.name}
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <span style={{ fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100px' }}>{t.name}</span>
                              <span style={{ color: 'var(--color-text-dim)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', flex: 1 }}>({t.email})</span>
                            </div>
                            <button
                              onClick={() => handleCopyEmail(t.email, t.id)}
                              className="btn btn-secondary"
                              style={{ padding: '6px', minWidth: 'auto', borderRadius: '4px', border: 'none', backgroundColor: 'rgba(255,255,255,0.03)' }}
                              title="Copier l'e-mail"
                            >
                              {isCopied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', width: '100%' }}>
                <button onClick={handleCloseAddAppModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  {t('finish')}
                </button>
                {submittedAppTesters.length > 0 && (
                  <button
                    onClick={() => handleSendInvitations(submittedAppId, submittedAppTesters)}
                    className="btn btn-primary"
                    style={{ flex: 2, gap: '6px' }}
                  >
                    <Mail size={16} /> {t('btn_invite_emails')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('modal_add_app_title')}</h3>
                <button onClick={handleCloseAddAppModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
              </div>
              <form onSubmit={handleAddAppSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">{t('label_app_title')}</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder={lang === 'fr' ? "Ex: MySaaS Dashboard, YomiGame Mobile..." : "E.g., MySaaS Dashboard, YomiGame Mobile..."}
                      value={newAppForm.title}
                      onChange={e => setNewAppForm({ ...newAppForm, title: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label className="form-label">{t('label_platform')}</label>
                      <select
                        className="form-control"
                        value={newAppForm.platform}
                        onChange={e => setNewAppForm({ ...newAppForm, platform: e.target.value })}
                      >
                        <option value="Web">{t('platform_web')}</option>
                        <option value="Android">{t('platform_android')}</option>
                        <option value="iOS">{t('platform_ios')}</option>
                        <option value="Windows">{t('platform_windows')}</option>
                        <option value="macOS">{t('platform_macos')}</option>
                        <option value="Linux">{t('platform_linux')}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('label_tester_limit')}</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        className="form-control"
                        value={newAppForm.tester_limit}
                        onChange={e => setNewAppForm({ ...newAppForm, tester_limit: parseInt(e.target.value) || 5 })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_app_url')}</label>
                    <input
                      type="url"
                      required
                      className="form-control"
                      placeholder="https://example.com ou lien de téléchargement..."
                      value={newAppForm.app_url}
                      onChange={e => setNewAppForm({ ...newAppForm, app_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_description')}</label>
                    <textarea
                      required
                      className="form-control"
                      rows="3"
                      placeholder={t('placeholder_description')}
                      value={newAppForm.description}
                      onChange={e => setNewAppForm({ ...newAppForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_instructions')}</label>
                    <textarea
                      required
                      className="form-control"
                      rows="3"
                      placeholder={t('placeholder_instructions')}
                      value={newAppForm.instructions}
                      onChange={e => setNewAppForm({ ...newAppForm, instructions: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={handleCloseAddAppModal} className="btn btn-secondary">{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary">{t('submit_project_btn')}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* MODALE RECHERCHE / AJOUT MANUEL TESTEUR */}
      {showAddTesterModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('modal_add_tester_title')}</h3>
              <button onClick={() => setShowAddTesterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>
            <form onSubmit={handleAddTesterSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('label_tester_name')}</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={lang === 'fr' ? "Ex: Jean Dupont, TesteurAlpha..." : "E.g., John Doe, AlphaTester..."}
                    value={newTesterForm.name}
                    onChange={e => setNewTesterForm({ ...newTesterForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('label_tester_email')}</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder={lang === 'fr' ? "Ex: testeur@example.com" : "E.g., tester@example.com"}
                    value={newTesterForm.email}
                    onChange={e => setNewTesterForm({ ...newTesterForm, email: e.target.value })}
                  />
                  <small style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    {t('tester_email_validation_note')}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddTesterModal(false)} className="btn btn-secondary">{t('cancel')}</button>
                <button type="submit" disabled={submittingTester} className="btn btn-primary">
                  {submittingTester ? t('btn_registering') : t('btn_register_tester')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 2 : FORMULAIRE DE TEST (TESTEUR) */}
      {showTestModal && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('modal_test_title', { title: selectedApp.title })}</h3>
              <button onClick={() => setShowTestModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>
            <form onSubmit={handleTestSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Consignes du test */}
                <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99,102,241,0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', marginBottom: '0.5rem' }}>
                    <Info size={16} /> {t('dev_instructions_title')}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>{selectedApp.instructions}</p>

                  <a href={selectedApp.app_url} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem', padding: '8px' }}>
                    {t('btn_open_app_test')} <ExternalLink size={14} />
                  </a>
                </div>

                {/* Évaluation Etoiles */}
                <div className="form-group">
                  <label className="form-label">{t('label_rating')}</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={28}
                        className={`star ${star <= testReportForm.rating ? 'star-filled' : 'star-empty'}`}
                        onClick={() => setTestReportForm({ ...testReportForm, rating: star })}
                      />
                    ))}
                  </div>
                </div>

                {/* Avis global */}
                <div className="form-group">
                  <label className="form-label">{t('label_feedback')}</label>
                  <textarea
                    required
                    className="form-control"
                    rows="3"
                    placeholder={t('placeholder_feedback')}
                    value={testReportForm.feedback}
                    onChange={e => setTestReportForm({ ...testReportForm, feedback: e.target.value })}
                  ></textarea>
                </div>

                {/* Bugs trouvés */}
                <div className="form-group">
                  <label className="form-label">{t('label_bugs')}</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder={t('placeholder_bugs')}
                    value={testReportForm.bugs_found}
                    onChange={e => setTestReportForm({ ...testReportForm, bugs_found: e.target.value })}
                  ></textarea>
                </div>

                {/* Info Système détectée */}
                <div className="form-group">
                  <label className="form-label">{t('label_system')}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={testReportForm.device_info}
                    onChange={e => setTestReportForm({ ...testReportForm, device_info: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowTestModal(false)} className="btn btn-secondary">{t('cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('btn_send_report')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 3 : LISTE DES RAPPORTS DE TEST (DEV) */}
      {showReviewDetailsModal && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('modal_reviews_title', { title: selectedApp.title })}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{t('modal_reviews_subtitle')}</p>
              </div>
              <button onClick={() => setShowReviewDetailsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>

            {/* Onglets de la modale */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', margin: '0 1.5rem', gap: '1.5rem' }}>
              <div
                onClick={() => setActiveModalTab('reviews')}
                style={{
                  padding: '10px 5px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  color: activeModalTab === 'reviews' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeModalTab === 'reviews' ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {t('modal_reviews_tab_reviews', { count: reviewsList.length })}
              </div>
              <div
                onClick={() => setActiveModalTab('participants')}
                style={{
                  padding: '10px 5px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  color: activeModalTab === 'participants' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeModalTab === 'participants' ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {t('modal_reviews_tab_participants', { count: participantsList.length })}
              </div>
            </div>

            <div className="modal-body" style={{ minHeight: '300px' }}>
              {activeModalTab === 'reviews' ? (
                loadingReviews ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="skeleton" style={{ height: '80px' }}></div>
                    <div className="skeleton" style={{ height: '80px' }}></div>
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <Info size={30} style={{ marginBottom: '0.75rem', color: 'var(--color-text-dim)' }} />
                    <p>{t('no_reviews_title')}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{t('no_reviews_desc')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {reviewsList.map(review => (
                      <div key={review.id} className="review-card" style={{ margin: 0 }}>
                        <div className="review-header">
                          <div className="tester-profile">
                            <img
                              src={review.tester_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50"}
                              alt={review.tester_name}
                              className="tester-pic"
                            />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.tester_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>{review.tester_email}</div>
                            </div>
                          </div>

                          {/* Note Etoiles en lecture seule */}
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= review.rating ? 'star-filled' : 'star-empty'}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Retour d'expérience */}
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4', whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>
                          {review.feedback}
                        </div>

                        {/* Bugs identifiés */}
                        {review.bugs_found && (
                          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <Bug size={14} /> {t('bug_reported_title')}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#991b1b', whiteSpace: 'pre-wrap' }}>
                              {review.bugs_found}
                            </div>
                          </div>
                        )}

                        {/* Info Système */}
                        <div className="tester-meta">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Monitor size={12} /> {review.device_info}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {new Date(review.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                loadingParticipants ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="skeleton" style={{ height: '80px' }}></div>
                    <div className="skeleton" style={{ height: '80px' }}></div>
                  </div>
                ) : participantsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <Info size={30} style={{ marginBottom: '0.75rem', color: 'var(--color-text-dim)' }} />
                    <p>{t('no_participants_title')}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{t('no_participants_desc')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {participantsList.map(participant => {
                      const isCopied = copiedUserId === participant.id;
                      return (
                        <div key={participant.id || participant.email} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-color)',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
                            <img
                              src={participant.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50"}
                              alt={participant.name || participant.email}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{participant.name || t('tester_volunteer')}</span>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{participant.email}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleCopyEmail(participant.email, participant.id)}
                              className="btn btn-secondary"
                              style={{ padding: '8px', minWidth: 'auto', borderRadius: 'var(--radius-sm)' }}
                              title="Copier l'adresse e-mail"
                            >
                              {isCopied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                            </button>

                            <button
                              onClick={() => handleInviteParticipant(selectedApp, participant)}
                              className="btn btn-accent"
                              style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', gap: '6px' }}
                              title="Envoyer une invitation de test"
                            >
                              <Mail size={14} /> {t('send')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowReviewDetailsModal(false)} className="btn btn-secondary">{t('close')}</button>
            </div>
          </div>
        </div>
      )}
      {/* MODALE PARTICIPATION PUBLIQUE */}
      {showParticipateModal && participateApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('modal_participate_title', { title: participateApp.title })}</h3>
              <button onClick={() => setShowParticipateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>
            {participateApp.status === 'completed' ? (
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {lang === 'fr'
                    ? "Cette phase de test est terminée. Voici le retour d'expérience du développeur et le lien vers la version finale de l'application."
                    : "This testing phase is completed. Here is the developer's feedback and the link to the final version of the application."}
                </p>

                {participateApp.dev_feedback && (
                  <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', marginBottom: '0.5rem' }}>
                      <Sparkles size={16} /> {t('dev_feedback_title')}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                      {participateApp.dev_feedback}
                    </p>
                  </div>
                )}

                {participateApp.prod_url && (
                  <a
                    href={participateApp.prod_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      gap: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      fontWeight: 600
                    }}
                  >
                    <ExternalLink size={16} /> {t('view_prod_app')}
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleParticipateSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {t('modal_participate_desc', { title: participateApp.title })}
                  </p>
                  <div className="form-group">
                    <label className="form-label">{t('label_your_email')}</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="Ex: testeur@example.com"
                      value={participateEmail}
                      onChange={e => setParticipateEmail(e.target.value)}
                    />
                    <small style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                      {t('modal_participate_note', { name: participateApp.developer_name })}
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowParticipateModal(false)} className="btn btn-secondary">{t('cancel')}</button>
                  <button type="submit" disabled={submittingParticipate} className="btn btn-accent">
                    {submittingParticipate ? t('joining_btn') : t('btn_participate_join')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            {t('footer_rights', { year: new Date().getFullYear() })}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Développé par <a href="https://nextbytechno.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Next Byte Technology</a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span onClick={() => setShowTermsModal(true)} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link">
              {t('footer_terms')}
            </span>
            <span onClick={() => setShowPrivacyModal(true)} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link">
              {t('footer_privacy')}
            </span>
          </div>
        </div>
      </footer>

      {/* MODALE POLITIQUE D'UTILISATION */}
      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('terms_title')}</h3>
              <button onClick={() => setShowTermsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('terms_sec1_title')}</h4>
              <p>{t('terms_sec1_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('terms_sec2_title')}</h4>
              <p><strong>{lang === 'fr' ? 'Développeurs : ' : 'Developers: '}</strong>{t('terms_sec2_dev')}</p>
              <p><strong>{lang === 'fr' ? 'Testeurs : ' : 'Testers: '}</strong>{t('terms_sec2_tester')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('terms_sec3_title')}</h4>
              <p>{t('terms_sec3_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('terms_sec4_title')}</h4>
              <p>{t('terms_sec4_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('terms_sec5_title')}</h4>
              <p>{t('terms_sec5_body')}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowTermsModal(false)} className="btn btn-secondary">{t('close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE CONFIDENTIALITÉ */}
      {showPrivacyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('privacy_title')}</h3>
              <button onClick={() => setShowPrivacyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('privacy_sec1_title')}</h4>
              <p>{t('privacy_sec1_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('privacy_sec2_title')}</h4>
              <p>{t('privacy_sec2_body')}</p>
              <ul>
                <li>{t('privacy_sec2_li1')}</li>
                <li>{t('privacy_sec2_li2')}</li>
              </ul>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('privacy_sec3_title')}</h4>
              <p>{t('privacy_sec3_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('privacy_sec4_title')}</h4>
              <p>{t('privacy_sec4_body')}</p>

              <h4 style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{t('privacy_sec5_title')}</h4>
              <p>{t('privacy_sec5_body')}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPrivacyModal(false)} className="btn btn-secondary">{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
