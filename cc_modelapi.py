from fastapi import FastAPI, Query
from pycaret.classification import load_model, predict_model
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

# Création de l'application
app = FastAPI()

# Ajout du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet l'accès depuis n'importe quelle origine. À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du modèle entraîné
model = load_model("cc_model")

@app.get("/predict")
async def predict(
    Age: int = Query(..., description="Âge du patient (en années)"),
    Sexe: int = Query(..., description="Sexe du patient (0: Homme, 1: Femme)"),
    Diabete: int = Query(..., description="Présence de diabète (0: Non, 1: Oui)"),
    Antecedents_Familiaux: int = Query(..., description="Antécédents familiaux de maladies cardiaques (0: Non, 1: Oui)"),
    Tabagisme: int = Query(..., description="Habitudes de tabagisme (0: Non-fumeur, 1: Fumeur)"),
    Obesite: int = Query(..., description="Présence d'obésité (0: Non, 1: Oui)"),
    Heures_Sommeil_Par_Jour: float = Query(..., description="Nombre d'heures de sommeil par jour"),
    Jours_Activite_Physique_Par_Semaine: int = Query(..., description="Nombre de jours d'activité physique par semaine"),
    Problemes_Cardiaques_Precedents: int = Query(..., description="Antécédents de problèmes cardiaques (0: Non, 1: Oui)"),
    Utilisation_Medicaments: int = Query(..., description="Utilisation de médicaments (0: Non, 1: Oui)")
):
    # Regroupement des données dans un dictionnaire
    data = {
        "Age": Age,
        "Sex": "Male" if Sexe == 0 else "Female",
        "Diabetes": "No" if Diabete == 0 else "Yes",
        "Family History": "No" if Antecedents_Familiaux == 0 else "Yes",
        "Smoking": "No" if Tabagisme == 0 else "Yes",
        "Obesity": "No" if Obesite == 0 else "Yes",
        "Sleep Hours Per Day": Heures_Sommeil_Par_Jour,
        "Physical Activity Days Per Week": Jours_Activite_Physique_Par_Semaine,
        "Previous Heart Problems": "No" if Problemes_Cardiaques_Precedents == 0 else "Yes",
        "Medication Use": "No" if Utilisation_Medicaments == 0 else "Yes"
    }
    
    # Conversion des données en DataFrame
    df = pd.DataFrame([data])
    
    try:
        # Réalisation de la prédiction
        predictions = predict_model(model, data=df)
        
        # Extraction de la prédiction et de la probabilité
        predicted_risk = predictions["prediction_label"].iloc[0]
        probability = predictions["prediction_score"].iloc[0]
        
        risk_map = {
            0: 'Faible risque de crise cardiaque',
            1: 'Risque élevé de crise cardiaque'
        }
        risk = risk_map.get(predicted_risk, 'Inconnu')
        
        return {
            "Risque prédit": risk,
            "Probabilité": f"{probability:.2f}"
        }
    except Exception as e:
        return {"erreur": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
