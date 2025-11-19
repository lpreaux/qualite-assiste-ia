import http from 'k6/http';
import { check, sleep, group } from 'k6';

// --------------------------
// Configuration de la charge
// --------------------------
export const options = {
  vus: 10, // 10 utilisateurs virtuels simultanés
  vus_max: 100,
  duration: '30s', // test de charge pendant 30 secondes
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes doivent répondre en < 500 ms
    http_req_failed: ['rate<0.01'], // <1% d'erreurs autorisées
  },
};

// --------------------------
// Variables globales
// --------------------------
const BASE_URL = 'http://localhost:8000/api/v1/client';

export default function () {
  group('Création de client', () => {
    const payload = JSON.stringify({
      nom: 'TestNom',
      prenom: 'TestPrenom',
      adresse: '1 rue des tests',
      email: `user_${Math.random().toString(16).slice(2)}@mail.com`,
    });

    const headers = { 'Content-Type': 'application/json' };

    const res = http.post(`${BASE_URL}/`, payload, { headers });

    check(res, {
      'POST /client répond 200': (r) => r.status === 200,
      'le corps contient un ID client': (r) =>
        r.json('codcli') !== undefined,
      'le nom est correct': (r) => r.json('nom') === 'TestNom',
    });

    const clientId = res.json('codcli');

    // Lecture du client
    const getRes = http.get(`${BASE_URL}/${clientId}`);
    check(getRes, {
      'GET /client/{id} répond 200': (r) => r.status === 200,
      'données cohérentes': (r) => r.json('prenom') === 'TestPrenom',
    });

    // Patch du client
    const patchPayload = JSON.stringify({ prenom: 'Modifié' });
    const patchRes = http.patch(
      `${BASE_URL}/${clientId}`,
      patchPayload,
      { headers }
    );

    check(patchRes, {
      'PATCH /client/{id} répond 200': (r) => r.status === 200,
      'le prénom a été mis à jour': (r) => r.json('prenom') === 'Modifié',
    });

    // Suppression du client
    const deleteRes = http.del(`${BASE_URL}/${clientId}`);
    check(deleteRes, {
      'DELETE /client/{id} répond 200': (r) => r.status === 200,
      'le client supprimé a bon ID': (r) =>
        deleteRes.json('codcli') === clientId,
    });

    // Vérifier que le client n’existe plus
    const checkDeleted = http.get(`${BASE_URL}/${clientId}`);
    check(checkDeleted, {
      'GET /client/{id} après suppression renvoie 404': (r) =>
        r.status === 404,
    });
  });

  // Petite pause pour simuler un utilisateur réel
  sleep(1);
}