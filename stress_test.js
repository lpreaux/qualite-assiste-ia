import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // montée à 10 VUs
    { duration: '30s', target: 50 },   // montée à 50 VUs
    { duration: '30s', target: 100 },  // montée à 100 VUs
    { duration: '30s', target: 200 },  // montée à 200 VUs
    { duration: '1m', target: 0 },     // redescente douce
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // <2 % de requêtes échouées
    http_req_duration: ['p(95)<800'], // 95 % des requêtes doivent < 800 ms
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8000/api/v1/client';

export default function () {
  const payload = JSON.stringify({
    nom: 'Stress',
    prenom: 'Test',
    adresse: 'Rue de la charge',
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(`${BASE_URL}/`, payload, { headers });

  check(res, {
    'POST répond 200': (r) => r.status === 200,
  });

  sleep(1);
}