import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  answers: Record<string, number>;
}

const calculateCarbonFootprint = (answers: Record<string, number>): number => {
  let total = 0;

  // 🚗 Transport
  total += (answers.car_km || 0) * 0.12 / 1000; // 0.12 t/1000 km
  const publicTransportImpact = {
    0: 0,
    1: 0.1,  // Occasionnellement
    2: 0.25, // Régulièrement
    3: 0.5   // Quotidiennement
  };
  total += publicTransportImpact[answers.public_transport as keyof typeof publicTransportImpact] || 0;

  // 🏠 Habitat
  total += (answers.home_size || 0) * 0.02;

  const energyImpact = {
    1: 0.5,  // Énergies renouvelables
    2: 3,    // Fioul
    3: 2,    // Gaz
    4: 1.5   // Électricité
  };
  total += energyImpact[answers.energy_type as keyof typeof energyImpact] || 0;

  // 🍽️ Alimentation
  const meatImpact = {
    1: 0.5,  // Jamais
    2: 1.2,  // Occasionnelle
    3: 2,    // Plusieurs fois par semaine
    4: 3     // Quotidienne
  };
  total += meatImpact[answers.meat_consumption as keyof typeof meatImpact] || 0;

  const localFoodImpact = {
    25: 1.2,
    50: 0.9,
    75: 0.5,
    100: 0.3
  };
  total += localFoodImpact[answers.local_food as keyof typeof localFoodImpact] || 0;

  // 🛍️ Consommation
  const shoppingImpact = {
    1: 0.3,
    2: 0.8,
    3: 1.5,
    4: 2.5
  };
  total += shoppingImpact[answers.shopping_habits as keyof typeof shoppingImpact] || 0;

  total += (answers.electronic_devices || 0) * 0.1;

  // ⚙️ Base incompressible (eau chaude, déchets, services publics)
  total += 1.5;

  // 👥 Répartition par nombre de personnes du foyer
  const household = answers.household || 1;
  total = total / household;

  return Math.round(total);
};

const getResultCategory = (carbonFootprint: number): {
  category: string;
  image: string;
  message: string;
} => {
  if (carbonFootprint <= 6.5) {
    return {
      category: "Excellent",
      image: "/images/good_result.svg",
      message: "Bravo ! Vous êtes sur la bonne voie vers l'objectif des 2 tonnes visé pour 2050. Continuez ainsi !"
    };
  } else if (carbonFootprint <= 10) {
    return {
      category: "Moyen",
      image: "/images/medium_result.svg",
      message: "Vous êtes dans la moyenne actuelle, mais encore loin de l'objectif climatique de 2 tonnes. Il y a encore de la marge pour l'améliorer !"
    };
  } else {
    return {
      category: "Mauvaise",
      image: "/images/bad_result.svg",
      message: "Vous dépassez la moyenne. Il est urgent d'agir pour réduire votre impact climatique. Suivez nos recommandations pour la réduire !"
    };
  }
};

const getRecommendations = (answers: Record<string, number>): string[] => {
  const recommendations: string[] = [];

  if ((answers.car_km || 0) > 15000) {
    recommendations.push("Essayez de réduire vos déplacements en voiture en privilégiant le covoiturage ou les transports en commun.");
  }

  if ((answers.meat_consumption || 0) > 2) {
    recommendations.push("Réduire votre consommation de viande aurait un impact significatif sur votre empreinte carbone.");
  }

  if ((answers.local_food || 0) < 50) {
    recommendations.push("Privilégiez les produits locaux et de saison pour réduire l'impact du transport des aliments.");
  }

  if ((answers.shopping_habits || 0) > 2) {
    recommendations.push("Envisagez d'acheter des vêtements d'occasion ou de prolonger la durée de vie de vos vêtements.");
  }

  if ((answers.electronic_devices || 0) > 10) {
    recommendations.push("Limitez l'achat de nouveaux appareils électroniques et privilégiez la réparation.");
  }

  return recommendations;
};

const Results: React.FC<Props> = ({ answers }) => {
  const carbonFootprint = calculateCarbonFootprint(answers);
  const { category, image, message } = getResultCategory(carbonFootprint);
  const recommendations = getRecommendations(answers);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Votre Empreinte Carbone
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 3, 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              margin: '2rem 0',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <img 
              src={image} 
              alt={`Résultat ${category}`}
              style={{ 
                width: '300px', 
                height: '300px', 
                objectFit: 'contain',
              }} 
            />
          </motion.div>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              {carbonFootprint}
              <Typography component="span" variant="h4" color="text.secondary">
                tonnes de CO₂ par an
              </Typography>
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 2 }}>
              {category}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {message}
            </Typography>
          </Box>
        </Paper>

        {recommendations.length > 0 && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              Recommandations personnalisées
            </Typography>
            
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    backgroundColor: 'rgba(46, 125, 50, 0.05)'
                  }}
                >
                  <Typography variant="body1">
                    {recommendation}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Paper>
        )}
      </motion.div>
    </Box>
  );
};

export default Results; 