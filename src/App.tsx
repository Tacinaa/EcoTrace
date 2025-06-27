import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Box, Typography, Stepper, Step, StepLabel, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CarbonQuestions, { questions, Question } from './components/CarbonQuestions';
import Results from './components/Results';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#81C784',
    },
  },
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
                    height: '100px',
                    width: 'auto'
                  }} 
                />
              </Box>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mt: 2, 
                  maxWidth: '600px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                  Découvrez votre impact sur l'environnement
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Répondez à quelques questions simples pour calculer votre empreinte carbone 
                  et obtenir des recommandations personnalisées pour la réduire.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Commencer le test
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
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
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
                    variant="contained"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    color="primary"
                  >
                    {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
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
