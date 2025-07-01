import React from 'react';
import { Box, Typography, Slider, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  step: number;
  onAnswer: (questionId: string, value: number) => void;
  answers: Record<string, number>;
  showErrors: boolean;
}

export interface Question {
  id: string;
  question: string;
  type?: 'radio';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  options?: Array<{ value: number; label: string }>;
  unit?: string;
}

export const questions: Record<number, Question[]> = {
  0: [ // Informations personnelles
    {
      id: 'household',
      question: 'Combien de personnes vivent dans votre foyer ?',
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 1,
      unit: 'personne(s)'
    },
    {
      id: 'age',
      question: 'Quel est votre âge ?',
      min: 18,
      max: 100,
      step: 1,
      defaultValue: 30,
      unit: 'ans'
    }
  ],
  1: [ // Transport
    {
      id: 'car_km',
      question: 'Combien de kilomètres parcourez-vous en voiture par an ?',
      min: 0,
      max: 50000,
      step: 1000,
      defaultValue: 10000,
      unit: 'km'
    },
    {
      id: 'public_transport',
      question: 'À quelle fréquence utilisez-vous les transports en commun ?',
      type: 'radio',
      options: [
        { value: 0, label: 'Jamais' },
        { value: 1, label: 'Occasionnellement' },
        { value: 2, label: 'Régulièrement' },
        { value: 3, label: 'Quotidiennement' }
      ]
    }
  ],
  2: [ // Habitat
    {
      id: 'home_size',
      question: 'Quelle est la surface de votre logement (en m²) ?',
      min: 0,
      max: 300,
      step: 10,
      defaultValue: 80,
      unit: 'm²'
    },
    {
      id: 'energy_type',
      question: 'Quel type d\'énergie utilisez-vous pour le chauffage ?',
      type: 'radio',
      options: [
        { value: 4, label: 'Électricité' },
        { value: 3, label: 'Gaz naturel' },
        { value: 2, label: 'Fioul' },
        { value: 1, label: 'Énergies renouvelables' }
      ]
    }
  ],
  3: [ // Alimentation
    {
      id: 'meat_consumption',
      question: 'Quelle est votre consommation de viande ?',
      type: 'radio',
      options: [
        { value: 4, label: 'Quotidienne' },
        { value: 3, label: 'Plusieurs fois par semaine' },
        { value: 2, label: 'Occasionnelle' },
        { value: 1, label: 'Jamais (végétarien/végétalien)' }
      ]
    },
    {
      id: 'local_food',
      question: 'Comment choisissez-vous vos aliments ?',
      type: 'radio',
      options: [
        { value: 100, label: 'Je privilégie toujours les produits locaux et de saison' },
        { value: 75, label: 'Je fais attention à acheter local et de saison quand c\'est possible' },
        { value: 50, label: 'J\'achète parfois local et de saison, mais ce n\'est pas ma priorité' },
        { value: 25, label: 'Je ne fais pas vraiment attention à la provenance et à la saison' }
      ]
    }
  ],
  4: [ // Consommation
    {
      id: 'shopping_habits',
      question: 'À quelle fréquence achetez-vous des vêtements neufs ?',
      type: 'radio',
      options: [
        { value: 4, label: 'Très souvent (plusieurs fois par mois)' },
        { value: 3, label: 'Régulièrement (une fois par mois)' },
        { value: 2, label: 'Occasionnellement (quelques fois par an)' },
        { value: 1, label: 'Rarement (une fois par an ou moins)' }
      ]
    },
    {
      id: 'electronic_devices',
      question: "Combien d'appareils électroniques possédez-vous ?",
      min: 0,
      max: 20,
      step: 1,
      defaultValue: 5,
      unit: 'appareil(s)'
    }
  ]
};

const CarbonQuestions: React.FC<Props> = ({ step, onAnswer, answers, showErrors }) => {
  const currentQuestions = questions[step as keyof typeof questions];

  const handleSliderChange = (questionId: string) => (_event: Event, newValue: number | number[]) => {
    onAnswer(questionId, newValue as number);
  };

  const handleRadioChange = (questionId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnswer(questionId, parseInt(event.target.value));
  };

  return (
    <Box>
      {currentQuestions.map((q, index) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          {/* Placeholder pour une petite illustration à côté de la question */}
          {/* <Box sx={{ fontSize: '2rem', textAlign: 'center', mb: 1 }}>{step === 0 ? '👤' : step === 1 ? '🚗' : '🏠'}</Box> */}
          <Box
            sx={{
              mb: 5,
              p: 2.5, // Un peu plus de padding
              borderRadius: '12px', // Bords arrondis
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(160, 210, 2DB, 0.1)' // Utilise la couleur primaire avec opacité
              }
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: '600', // Un peu plus gras
                color: 'text.primary',
                mb: 2.5,
                textAlign: 'center' // Centrer le titre de la question
              }}
            >
              {q.question}
            </Typography>
            {q.type === 'radio' ? (
              <FormControl component="fieldset" required error={showErrors && answers[q.id] === undefined} sx={{ width: '100%'}}>
                <RadioGroup
                  value={answers[q.id] || ''}
                  onChange={handleRadioChange(q.id)}
                  sx={{ alignItems: 'center' }} // Centrer les options radio
                >
                  {q.options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }} color="primary"/>}
                      label={<Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>{option.label}</Typography>}
                      sx={{
                        mb: 0.5,
                        p: 1,
                        borderRadius: '8px',
                        width: 'fit-content', // Ajuster la largeur au contenu
                        '&:hover': {
                          backgroundColor: 'secondary.main', // Rose pastel léger au survol
                        },
                        '&.Mui-focused': { // Style quand l'élément est focus (pour accessibilité)
                          outline: `2px solid #BEE7B8`, // Vert pastel pour l'outline
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
                {showErrors && answers[q.id] === undefined && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, fontWeight: '600', textAlign: 'center' }}>
                    Veuillez sélectionner une option
                  </Typography>
                )}
              </FormControl>
            ) : (
              <Box sx={{ px: 2 }}> {/* Ajout de padding horizontal pour le slider */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'center' }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {answers[q.id] || q.defaultValue || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    {q.unit}
                  </Typography>
                </Box>
                <Slider
                  value={answers[q.id] || q.defaultValue || 0}
                  onChange={handleSliderChange(q.id)}
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  marks
                  valueLabelDisplay="auto"
                  color="primary" // Utilise la couleur primaire du thème
                  sx={{
                    mt: 1,
                    '& .MuiSlider-thumb': {
                      height: 22,
                      width: 22,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor', // currentColor prendra la couleur primaire
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(160, 210, 219, 0.3)', // Ombre de focus avec la couleur primaire
                      },
                    },
                    '& .MuiSlider-track': {
                      height: 6,
                      borderRadius: 3,
                    },
                    '& .MuiSlider-rail': {
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(160, 210, 219, 0.4)', // Rail plus clair
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.85rem',
                      color: 'text.secondary',
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default CarbonQuestions; 