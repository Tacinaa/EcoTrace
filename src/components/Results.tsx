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
  image: string; // Gardons image pour l'instant, mais on pourrait le remplacer par un identifiant d'illustration
  message: string;
  color: string; // Nouvelle propriété pour la couleur associée à la catégorie
} => {
  if (carbonFootprint <= 6.5) {
    return {
      category: "Excellent",
      image: "/images/good_result.svg", // Remplacer par une nouvelle illustration pastel
      message: "Félicitations ! Votre empreinte est faible. Continuez vos efforts écologiques !",
      color: "#BEE7B8" // Vert pastel frais (success.main)
    };
  } else if (carbonFootprint <= 10) {
    return {
      category: "Bon Effort", // Changement de nom pour être plus positif
      image: "/images/medium_result.svg", // Remplacer par une nouvelle illustration pastel
      message: "C'est un bon début ! Quelques ajustements peuvent encore réduire votre impact.",
      color: "#A0D2DB" // Bleu pastel doux (primary.main)
    };
  } else {
    return {
      category: "À Améliorer", // Changement de nom
      image: "/images/bad_result.svg", // Remplacer par une nouvelle illustration pastel
      message: "Votre empreinte est un peu élevée. Découvrez nos conseils pour l'alléger.",
      color: "#FEEAFA" // Rose pastel léger (secondary.main) - ou une couleur plus "alerte" pastel
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

// Placeholder pour les nouvelles images/illustrations pastel
const resultImages = {
  Excellent: "🌿", // Idéalement: '/images/pastel_good_result.svg',
  "Bon Effort": "🌍", // Idéalement: '/images/pastel_medium_result.svg',
  "À Améliorer": "💡" // Idéalement: '/images/pastel_bad_result.svg',
};

const Results: React.FC<Props> = ({ answers }) => {
  const carbonFootprint = calculateCarbonFootprint(answers);
  const { category, message, color } = getResultCategory(carbonFootprint);
  // Utiliser le placeholder emoji si l'image spécifique n'est pas définie
  const image = resultImages[category as keyof typeof resultImages] || "❓";
  const recommendations = getRecommendations(answers);

  return (
    <Box sx={{ py: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Typography variant="h3" gutterBottom align="center" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 4 }}>
          Votre Bilan Carbone Personnel
        </Typography>
        
        <Paper 
          elevation={0} // Pas d'ombre pour un look plus plat et moderne
          sx={{ 
            p: { xs: 3, sm: 4 },
            mb: 4,
            textAlign: 'center',
            maxWidth: '700px', // Un peu plus étroit pour un meilleur focus
            mx: 'auto',
            backgroundColor: color, // Utilise la couleur de la catégorie
            borderRadius: '16px', // Bords arrondis cohérents
            overflow: 'hidden', // Pour s'assurer que les éléments enfants respectent le border radius
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
            style={{
              margin: '1rem 0 2rem 0', // Ajustement des marges
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* Remplacer l'ancienne image par un placeholder texte/emoji pour l'illustration */}
            <Typography variant="h1" sx={{ fontSize: '6rem' }}>{image}</Typography>
            {/* <img
              src={image} 
              alt={`Résultat ${category}`}
              style={{ 
                width: '200px', // Taille réduite pour un design plus épuré
                height: '200px',
                objectFit: 'contain',
              }} 
            /> */}
          </motion.div>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h1" sx={{ color: 'common.white', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1 }}>
              {carbonFootprint}
              <Typography component="span" variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'normal' }}>
                tonnes CO₂/an
              </Typography>
            </Typography>
            <Typography variant="h4" sx={{ color: 'common.white', fontWeight: '600', mt: 1.5 }}>
              {category}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1.5, px:2, fontSize:'1.1rem' }}>
              {message}
            </Typography>
          </Box>
        </Paper>

        {recommendations.length > 0 && (
          <Box sx={{ maxWidth: '700px', mx: 'auto', px: {xs: 1, sm: 0} }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: '600', mb: 3, textAlign: 'center' }}>
               pistes d'amélioration
            </Typography>
            
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.4, ease: "easeOut", duration: 0.5 }}
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5,
                    mb: 2,
                    backgroundColor: 'background.paper', // Fond papier standard
                    borderLeft: `5px solid ${color}`, // Bordure colorée rappelant la catégorie
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                    {recommendation}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Results; 