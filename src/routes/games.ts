import { Router, Request, Response, NextFunction } from 'express';
import { verifyApiKey, AuthRequest } from '../middleware/auth';

const router = Router();

// IQC - Intelligence Quotient Challenge
// GET /api/games/iqc
router.get('/iqc', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { difficulty = 'medium' } = req.query;

    const questions = {
      easy: [
        {
          id: 1,
          question: 'Berapa hasil dari 2 + 2?',
          options: ['3', '4', '5', '6'],
          correct: 1,
          timeLimit: 10,
        },
        {
          id: 2,
          question: 'Berapa hari dalam seminggu?',
          options: ['5', '6', '7', '8'],
          correct: 2,
          timeLimit: 10,
        },
      ],
      medium: [
        {
          id: 1,
          question: 'Jika A = 5 dan B = 3, berapa A² + B²?',
          options: ['30', '32', '34', '36'],
          correct: 2,
          timeLimit: 15,
        },
        {
          id: 2,
          question: 'Apa ibukota Indonesia?',
          options: ['Surabaya', 'Jakarta', 'Bandung', 'Medan'],
          correct: 1,
          timeLimit: 15,
        },
      ],
      hard: [
        {
          id: 1,
          question: 'Jika x³ = 27, berapa nilai x?',
          options: ['2', '3', '4', '5'],
          correct: 1,
          timeLimit: 20,
        },
        {
          id: 2,
          question: 'Siapa presiden Indonesia ke-1?',
          options: ['Soekarno', 'Soeharto', 'Habibie', 'Wahid'],
          correct: 0,
          timeLimit: 20,
        },
      ],
    };

    const quiz = questions[difficulty as keyof typeof questions] || questions.medium;

    res.json({
      success: true,
      data: {
        gameType: 'IQC Challenge',
        difficulty: difficulty,
        totalQuestions: quiz.length,
        questions: quiz,
        scorePerQuestion: 10,
        maxScore: quiz.length * 10,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Submit IQC Answer
// POST /api/games/iqc/submit
router.post('/iqc/submit', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    if (questionId === undefined || selectedAnswer === undefined) {
      res.status(400).json({
        success: false,
        message: 'questionId and selectedAnswer are required',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        questionId: questionId,
        submitted: true,
        isCorrect: true,
        points: 10,
        feedback: 'Jawaban Anda benar!',
      },
    });
  } catch (err) {
    next(err);
  }
});

// Word Game
// GET /api/games/word-game
router.get('/word-game', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { difficulty = 'easy' } = req.query;

    res.json({
      success: true,
      data: {
        gameType: 'Word Game',
        difficulty: difficulty,
        word: 'PROGRAMMING',
        shuffled: 'RGOMARPMING',
        hint: 'Keahlian menulis kode komputer',
        timeLimit: 120,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Guess Number Game
// POST /api/games/guess-number
router.post('/guess-number', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { guess } = req.body;
    const { min = 1, max = 100 } = req.body;

    if (guess === undefined) {
      res.status(400).json({
        success: false,
        message: 'Guess parameter is required',
      });
      return;
    }

    const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const isCorrect = guess === secretNumber;
    const hint = guess < secretNumber ? 'Terlalu kecil' : 'Terlalu besar';

    res.json({
      success: true,
      data: {
        guess: guess,
        isCorrect: isCorrect,
        hint: isCorrect ? 'Selamat! Jawaban benar!' : hint,
        secretNumber: isCorrect ? secretNumber : null,
        range: `${min} - ${max}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Daily Challenge
// GET /api/games/daily-challenge
router.get('/daily-challenge', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        gameType: 'Daily Challenge',
        challenge: 'Jawab 10 pertanyaan dalam 5 menit',
        reward: 100,
        difficulty: 'medium',
        timeLimit: 300,
        status: 'available',
        completedToday: false,
        nextReset: '2026-04-24T00:00:00Z',
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
