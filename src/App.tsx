import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Box, Typography, Stepper, Step, StepLabel, Button, Paper } from '@mui/material';
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
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showErrors, setShowErrors] = useState(false);

  const areAllRadioQuestionsAnswered = () => {
    const currentQuestions = questions[activeStep as keyof typeof questions];
    return currentQuestions
      .filter((q: Question) => q.type === 'radio')
      .every((q: Question) => answers[q.id] !== undefined);
  };

  const handleNext = () => {
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
                width: 'auto'
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Simulateur d'Empreinte Carbone
          </Typography>
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
