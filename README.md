# Qualité applicative assistée par IA — exercice de formation

Support technique d'un exercice de formation autour de la qualité d'une API : tests fonctionnels, contrôle de style et scénarios de charge.

Le support de cours d'origine n'est pas distribué dans ce dépôt. Seul le code produit pour l'exercice est conservé.

## Contenu

- une API CRUD FastAPI pour gérer des clients ;
- une base SQLite créée localement au démarrage ;
- des tests pytest intégrés au module de démonstration ;
- des scénarios k6 fonctionnels et de montée en charge.

## Lancement

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

La documentation OpenAPI est disponible sur <http://localhost:8000/docs>.

## Vérifications

```bash
pytest app.py
flake8 app.py
k6 run test.js
k6 run stress_test.js
```

`test.db`, les caches Python et les variables d'environnement sont générés localement et ignorés par Git.
