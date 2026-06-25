// frontend/src/api.js

const API_BASE = '/api';

/**
 * Helper standard pour faire des requêtes HTTP avec l'en-tête d'autorisation
 */
async function request(endpoint, options = {}) {
  const user = getStoredUser();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  if (user && user.auth_token) {
    headers['Authorization'] = `Bearer ${user.auth_token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Erreur serveur (code ${response.status})`);
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur API lors de l'appel à ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Récupère l'utilisateur stocké dans le cache local
 */
export function getStoredUser() {
  const userStr = localStorage.getItem('yomitest_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    localStorage.removeItem('yomitest_user');
    return null;
  }
}

/**
 * Enregistre l'utilisateur dans le cache local
 */
export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('yomitest_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('yomitest_user');
  }
}

/**
 * Authentification de l'utilisateur (réelle avec Google ou simulée en Mock)
 */
export async function loginUser(payload) {
  const response = await request('/auth/google.php', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (response.success && response.user) {
    setStoredUser(response.user);
  }
  return response;
}

/**
 * Déconnexion de l'utilisateur
 */
export function logoutUser() {
  setStoredUser(null);
}

/**
 * Récupère le profil et les statistiques de l'utilisateur connecté
 */
export async function getProfile() {
  return await request('/profile.php');
}

/**
 * Soumet une application à tester
 */
export async function createApplication(appData) {
  return await request('/apps/create.php', {
    method: 'POST',
    body: JSON.stringify(appData)
  });
}

/**
 * Liste des applications
 * @param {string} filter 'to_test' ou 'my_apps'
 */
export async function listApplications(filter = 'to_test') {
  return await request(`/apps/list.php?filter=${filter}`);
}

/**
 * Détails d'une application
 */
export async function getApplicationDetails(appId) {
  return await request(`/apps/details.php?id=${appId}`);
}

/**
 * Soumet un rapport de test
 */
export async function submitTestReview(reviewData) {
  return await request('/tests/submit.php', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

/**
 * Liste les rapports de test pour une application (développeur de l'app uniquement)
 */
export async function listReviews(appId) {
  return await request(`/tests/list.php?app_id=${appId}`);
}

/**
 * Liste tous les utilisateurs/testeurs enregistrés de la plateforme
 */
export async function listUsers() {
  return await request('/users/list.php');
}

/**
 * Enregistre le nombre d'e-mails envoyés pour une application
 */
export async function trackSendEmails(appId, count) {
  return await request('/apps/track_send.php', {
    method: 'POST',
    body: JSON.stringify({ app_id: appId, count })
  });
}

/**
 * Enregistre manuellement un testeur dans la table testeurs
 */
export async function createManualUser(userData) {
  return await request('/testeurs/register.php', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * Enregistre un testeur depuis la landing page dans la table testeurs
 */
export async function registerTesteur(email) {
  return await request('/testeurs/register.php', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/**
 * Liste tous les testeurs enregistrés
 */
export async function listTesteurs() {
  return await request('/testeurs/list.php');
}

/**
 * Enregistre un participant pour une application spécifique
 */
export async function submitAppParticipation(payload) {
  return await request('/apps/participate.php', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Liste les participants inscrits pour une application spécifique
 */
export async function listAppParticipants(appId) {
  return await request(`/apps/participants_list.php?app_id=${appId}`);
}

/**
 * Récupère les statistiques d'administration filtrées par période, mois et année
 */
export async function getAdminStats(period = 'all', month = null, year = null) {
  let url = `/admin/stats.php?period=${period}`;
  if (month) url += `&month=${month}`;
  if (year) url += `&year=${year}`;
  return await request(url);
}

/**
 * Soumet un avis sur la plateforme
 */
export async function submitPlatformFeedback(feedbackData) {
  return await request('/feedbacks/create.php', {
    method: 'POST',
    body: JSON.stringify(feedbackData)
  });
}

/**
 * Récupère les avis approuvés pour la page d'accueil
 */
export async function listApprovedFeedbacks() {
  return await request('/feedbacks/list_approved.php');
}

/**
 * Récupère tous les avis pour l'administration
 */
export async function listAdminFeedbacks() {
  return await request('/feedbacks/admin_list.php');
}

/**
 * Modère un avis (approve, disapprove, delete)
 */
export async function moderatePlatformFeedback(id, action) {
  return await request('/feedbacks/admin_approve.php', {
    method: 'POST',
    body: JSON.stringify({ id, action })
  });
}


export async function getPublicStats() {
  return request('/public_stats.php');
}

/**
 * Met à jour le statut d'une application (en cours / terminé) avec avis et lien en production
 */
export async function updateApplicationStatus(appId, status, devFeedback, prodUrl) {
  return await request('/apps/update_status.php', {
    method: 'POST',
    body: JSON.stringify({
      app_id: appId,
      status,
      dev_feedback: devFeedback,
      prod_url: prodUrl
    })
  });
}

/**
 * Enregistre une visite sur la plateforme
 */
export async function trackVisitor() {
  try {
    await fetch(`${API_BASE}/track_visitor.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    // Échouer silencieusement
  }
}
