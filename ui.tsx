import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const questionsEN = [
  { key: 'Age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
  { key: 'Sex', label: 'Sex', type: 'select', options: [
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' },
  ]},
  { key: 'Diabetes', label: 'Diabetes', type: 'select', options: [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' },
  ]},
  { key: 'FamilyHistory', label: 'Family History of Heart Disease', type: 'select', options: [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' },
  ]},
  { key: 'Smoking', label: 'Smoking', type: 'select', options: [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' },
  ]},
  { key: 'PhysicalActivity', label: 'Days of Physical Activity Per Week', type: 'number', placeholder: 'Enter number of days' },
];

const questionsAR = [
  { key: 'Age', label: 'العمر', type: 'number', placeholder: 'أدخل عمرك' },
  { key: 'Sex', label: 'الجنس', type: 'select', options: [
    { value: 0, label: 'ذكر' },
    { value: 1, label: 'أنثى' },
  ]},
  { key: 'Diabetes', label: 'السكري', type: 'select', options: [
    { value: 0, label: 'لا' },
    { value: 1, label: 'نعم' },
  ]},
  { key: 'FamilyHistory', label: 'تاريخ عائلي لأمراض القلب', type: 'select', options: [
    { value: 0, label: 'لا' },
    { value: 1, label: 'نعم' },
  ]},
  { key: 'Smoking', label: 'التدخين', type: 'select', options: [
    { value: 0, label: 'لا' },
    { value: 1, label: 'نعم' },
  ]},
  { key: 'PhysicalActivity', label: 'أيام النشاط البدني في الأسبوع', type: 'number', placeholder: 'أدخل عدد الأيام' },
];

const healthTipsEN = [
  "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
  "Exercise regularly, aiming for at least 150 minutes of moderate activity per week.",
  "Avoid smoking and limit alcohol consumption.",
  "Manage stress through relaxation techniques like meditation or yoga.",
  "Get regular health check-ups to detect potential issues early.",
];

const healthTipsAR = [
  "حافظ على نظام غذائي متوازن غني بالفواكه والخضروات والحبوب الكاملة.",
  "مارس الرياضة بانتظام، واهدف إلى 150 دقيقة على الأقل من النشاط المعتدل أسبوعياً.",
  "تجنب التدخين وحد من استهلاك الكحول.",
  "تحكم في التوتر من خلال تقنيات الاسترخاء مثل التأمل أو اليوغا.",
  "احصل على فحوصات صحية منتظمة للكشف عن المشاكل المحتملة مبكراً.",
];

const QuestionComponent = ({ question, value, onChange, language }) => {
  if (question.type === 'number') {
    return (
      <div className="space-y-2">
        <Label htmlFor={question.key}>{question.label}</Label>
        <Input
          id={question.key}
          type="number"
          placeholder={question.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  } else if (question.type === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={question.key}>{question.label}</Label>
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'en' ? "Select an option" : "اختر خياراً"} />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
};

const HeartRiskPredictor = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [language, setLanguage] = useState('en');
  const questions = language === 'en' ? questionsEN : questionsAR;
  const healthTips = language === 'en' ? healthTipsEN : healthTipsAR;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitPrediction();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].key]: value });
  };

  const submitPrediction = async () => {
    // Simulate API call
    setTimeout(() => {
      setPrediction({
        "Risk": Math.random() > 0.5 ? "Low risk of heart attack" : "High risk of heart attack",
        "Probability": (Math.random() * 0.5 + 0.5).toFixed(2)
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-indigo-700">
              {language === 'en' ? 'Heart Risk Predictor' : 'مؤشر خطر أمراض القلب'}
            </CardTitle>
            <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription className="text-center text-gray-600">
            {language === 'en' ? 'Answer the questions to assess your risk' : 'أجب على الأسئلة لتقييم المخاطر'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="questionnaire" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questionnaire">{language === 'en' ? 'Questionnaire' : 'الاستبيان'}</TabsTrigger>
              <TabsTrigger value="info">{language === 'en' ? 'Health Info' : 'معلومات صحية'}</TabsTrigger>
            </TabsList>
            <TabsContent value="questionnaire">
              <AnimatePresence mode="wait">
                {prediction ? (
                  <motion.div
                    key="prediction"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <div className={`text-4xl font-bold ${prediction.Risk.includes('Low') ? 'text-green-600' : 'text-red-600'}`}>
                      {language === 'en' ? prediction.Risk : (prediction.Risk.includes('Low') ? 'خطر منخفض للإصابة بنوبة قلبية' : 'خطر مرتفع للإصابة بنوبة قلبية')}
                    </div>
                    <div className="text-xl">
                      {language === 'en' ? 'Probability:' : 'الاحتمالية:'} {prediction.Probability}
                    </div>
                    {prediction.Risk.includes('Low') ? (
                      <Heart className="mx-auto text-green-500" size={48} />
                    ) : (
                      <AlertTriangle className="mx-auto text-red-500" size={48} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 text-sm font-medium text-gray-500">
                      {language === 'en' ? `Question ${currentQuestion + 1} of ${questions.length}` : `السؤال ${currentQuestion + 1} من ${questions.length}`}
                    </div>
                    <QuestionComponent
                      question={questions[currentQuestion]}
                      value={answers[questions[currentQuestion].key]}
                      onChange={handleChange}
                      language={language}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="info">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{language === 'en' ? 'Health Tips' : 'نصائح صحية'}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {healthTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!prediction ? (
            <>
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {language === 'en' ? 'Previous' : 'السابق'}
              </Button>
              <Button onClick={handleNext}>
                {currentQuestion === questions.length - 1 ? (language === 'en' ? 'Submit' : 'إرسال') : (language === 'en' ? 'Next' : 'التالي')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={() => {setCurrentQuestion(0); setPrediction(null); setAnswers({});}}>
              {language === 'en' ? 'Start Over' : 'البدء من جديد'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default HeartRiskPredictor;
