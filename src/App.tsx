import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Box, Typography, Stepper, Step, StepLabel, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CarbonQuestions, { questions, Question } from './components/CarbonQuestions';
import Results from './components/Results';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A0D2DB', // Bleu pastel doux
    },
    secondary: {
      main: '#FEEAFA', // Rose pastel léger
    },
    success: { // Utilisé pour l'accent vert
      main: '#BEE7B8',
    },
    background: {
      default: '#FDFDFD', // Légèrement ajusté pour un blanc encore plus doux
      paper: '#FFFFFF',
    },
    text: {
      primary: '#36454F', // Charcoal grey doux
      secondary: '#708090', // Slate grey
    },
    // Ajout de teintes plus claires pour primary et success pour hover/focus states
    primaryLight: {
      main: 'rgba(160, 210, 219, 0.3)', // Bleu pastel avec opacité
    },
    successLight: {
      main: 'rgba(190, 231, 184, 0.3)', // Vert pastel avec opacité
    },
  },
  typography: {
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Arial, sans-serif",
    h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
    h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
    h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
    button: {
      fontFamily: "'Poppins', sans-serif",
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Default border radius pour les boutons
          paddingTop: '10px',
          paddingBottom: '10px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            // L'effet de soulèvement et de shadow sera géré spécifiquement là où c'est pertinent
            // pour ne pas surcharger tous les boutons par défaut.
          }
        },
        containedPrimary: {
          '&:hover': {
             backgroundColor: '#89C4D1', // Un bleu pastel légèrement plus foncé
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          // La couleur est définie par la prop `color` dans le composant,
          // mais on peut définir des styles par défaut ici si nécessaire.
        },
        thumb: {
          // Styles de base pour le thumb, peuvent être surchargés par `sx`
           '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
             boxShadow: `0 0 0 8px rgba(160, 210, 219, 0.16)`, // Utilise primaryLight ou une version de primary.main
           },
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          // Styles pour MuiRadio si nécessaire globalement
        }
      }
    }
  }
});

const steps = ['Informations personnelles', 'Transport', 'Habitat', 'Alimentation', 'Consommation'];

function App() {
  const [activeStep, setActiveStep] = useState(-1); // -1 pour la page d'accueil
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showErrors, setShowErrors] = useState(false);

  const areAllRadioQuestionsAnswered = () => {
    const currentQuestions = questions[activeStep as keyof typeof questions];
    return currentQuestions
      .filter((q: Question) => q.type === 'radio')
      .every((q: Question) => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (activeStep === -1) {
      setActiveStep(0);
      return;
    }
    
    const hasRadioQuestions = questions[activeStep as keyof typeof questions]
      .some((q: Question) => q.type === 'radio');

    if (!hasRadioQuestions || areAllRadioQuestionsAnswered()) {
      setActiveStep((prevStep) => prevStep + 1);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setShowErrors(false);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleRestart = () => {
    setActiveStep(-1);
    setAnswers({});
    setShowErrors(false);
  };

  if (activeStep === -1) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box sx={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            pt: 4
          }}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <img 
                  src="/images/logo.svg" 
                  alt="ÉcoTrace" 
                  style={{ 
                  height: '120px', // Logo un peu plus grand
                    width: 'auto'
                  }} 
                />
              </Box>
            </motion.div>

          {/* Illustration d'accueil */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 120 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            {/* Placeholder pour une illustration. Idéalement, ce serait un SVG ou une image. */}
            {/* Pour l'instant, utilisons un emoji ou un simple div stylisé */}
            <Typography variant="h1" sx={{ fontSize: '4rem' }}>🌿</Typography>
            {/* <Box sx={{ width: 200, height: 150, backgroundColor: 'secondary.light', borderRadius: 3, margin: 'auto' }} /> */}
          </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }} // Délai ajusté
            >
              <Paper 
              elevation={6} // Ombre plus douce et moderne
                sx={{ 
                p: 4, // Plus de padding
                  mt: 2, 
                  maxWidth: '600px',
                  textAlign: 'center',
                backgroundColor: 'background.paper', // Utilise la couleur de fond du thème
                borderRadius: 3, // Bords plus arrondis
                }}
              >
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Calculez Votre Éco-Trace
                </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 'normal' }}>
                Un petit pas pour vous, un grand pas pour la planète. Découvrez votre empreinte carbone
                et explorez des gestes simples pour un avenir plus durable.
                </Typography>
                <Button
                  variant="contained"
                color="primary" // Utilise la couleur primaire du thème
                  size="large"
                  onClick={handleNext}
                  sx={{ 
                  px: 5,
                    py: 1.5,
                  fontSize: '1.2rem',
                  borderRadius: '25px', // Bouton plus arrondi
                  boxShadow: '0px 4px 15px rgba(160, 210, 219, 0.5)', // Ombre personnalisée
                    '&:hover': {
                    backgroundColor: 'primary.dark', // Assombrir au survol
                    transform: 'translateY(-2px)', // Léger effet de soulèvement
                    boxShadow: '0px 6px 20px rgba(160, 210, 219, 0.7)',
                  },
                  transition: 'all 0.3s ease-in-out'
                  }}
                >
                Commencer l'aventure écologique
                </Button>
              </Paper>
            </motion.div>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <img 
              src="/images/logo.svg" 
              alt="ÉcoTrace" 
              style={{ 
                height: '120px',
                width: 'auto',
                cursor: 'pointer'
              }} 
              onClick={handleRestart}
            />
          </Box>
          <Paper
            elevation={4} // Ombre plus subtile
            sx={{
              p: activeStep === steps.length ? 0 : 3, // Pas de padding si c'est la page de résultats
              mb: 4,
              borderRadius: '16px', // Plus arrondi
              backgroundColor: activeStep === steps.length ? 'transparent' : 'background.paper', // Transparent pour la page de résultats
              boxShadow: activeStep === steps.length ? 'none' : '0px 8px 25px rgba(0, 0, 0, 0.05)', // Ombre conditionnelle
            }}
          >
            {activeStep !== steps.length && ( // Afficher le Stepper uniquement si ce n'est pas la page de résultats
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: 'text.secondary'
                        },
                        '& .MuiStepLabel-label.Mui-active': {
                          color: 'primary.main',
                          fontWeight: '600'
                        },
                        '& .MuiStepLabel-label.Mui-completed': {
                          color: 'success.main', // Utilise la couleur d'accent vert
                           fontWeight: '600'
                        },
                        '& .MuiStepIcon-root.Mui-active': {
                          color: 'primary.main',
                        },
                        '& .MuiStepIcon-root.Mui-completed': {
                          color: 'success.main',
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Paper>

          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)'
            }}
          >
            {activeStep === steps.length ? (
              <Results answers={answers} />
            ) : (
              <div data-step={activeStep}>
                <CarbonQuestions 
                  step={activeStep} 
                  onAnswer={handleAnswer} 
                  answers={answers}
                  showErrors={showErrors}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined" // Style différent pour Précédent
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      color: 'text.secondary',
                      borderColor: 'text.secondary',
                       '&:hover': {
                        borderColor: 'text.primary',
                        backgroundColor: 'rgba(0,0,0,0.02)'
                       }
                    }}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    color="primary"
                    sx={{
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      boxShadow: '0px 4px 12px rgba(160, 210, 219, 0.4)',
                       '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0px 6px 15px rgba(160, 210, 219, 0.6)',
                       }
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Voir mes résultats' : 'Suivant'}
                  </Button>
                </Box>
              </div>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
