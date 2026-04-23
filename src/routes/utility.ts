import { Router, Request, Response, NextFunction } from 'express';
import { verifyApiKey, AuthRequest } from '../middleware/auth';

const router = Router();

// Jadwal Sholat by Location
// GET /api/utility/jadwal-sholat?city=jakarta&date=2026-04-23
router.get('/jadwal-sholat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city = 'Jakarta', date } = req.query;

    // Dummy data - in production connect to real prayer time API
    const prayerTimes = {
      Fajr: '04:35',
      Dhuhr: '12:02',
      Asr: '15:26',
      Maghrib: '18:05',
      Isha: '19:20',
    };

    res.json({
      success: true,
      data: {
        city: city,
        date: date || new Date().toISOString().split('T')[0],
        hijri: '15 Syawwal 1447',
        prayerTimes: prayerTimes,
        imsak: '04:25',
        nextPrayer: 'Dhuhr at 12:02',
      },
    });
  } catch (err) {
    next(err);
  }
});

// Cuaca (Weather)
// GET /api/utility/cuaca?city=jakarta
router.get('/cuaca', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city = 'Jakarta' } = req.query;

    res.json({
      success: true,
      data: {
        city: city,
        temperature: 28,
        temperatureFeelsLike: 32,
        condition: 'Partly Cloudy',
        humidity: 75,
        windSpeed: 12,
        windDirection: 'NE',
        uvIndex: 7,
        visibility: 10,
        pressure: 1013,
        forecast: [
          {
            date: '2026-04-23',
            maxTemp: 32,
            minTemp: 24,
            condition: 'Rainy',
            humidity: 80,
          },
          {
            date: '2026-04-24',
            maxTemp: 31,
            minTemp: 23,
            condition: 'Cloudy',
            humidity: 75,
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
});

// Berita (News)
// GET /api/utility/berita?category=nasional
router.get('/berita', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category = 'nasional', limit = 10 } = req.query;

    res.json({
      success: true,
      data: {
        category: category,
        total: 150,
        articles: [
          {
            id: 1,
            title: 'Breaking News: Update Teknologi Terbaru',
            description: 'Teknologi terbaru dalam dunia digital...',
            image: 'https://example.com/news1.jpg',
            source: 'Berita Nasional',
            published: '2026-04-23T10:30:00Z',
            url: 'https://example.com/news1',
          },
          {
            id: 2,
            title: 'Ekonomi Indonesia Tumbuh Positif',
            description: 'Pertumbuhan ekonomi mencapai...',
            image: 'https://example.com/news2.jpg',
            source: 'Berita Ekonomi',
            published: '2026-04-23T09:15:00Z',
            url: 'https://example.com/news2',
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
});

// QR Code Generator
// POST /api/utility/qrcode
router.post('/qrcode', verifyApiKey, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data, size = 200, format = 'png' } = req.body;

    if (!data) {
      res.status(400).json({
        success: false,
        message: 'Data is required for QR code generation',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        size: size,
        format: format,
        dataEncoded: data,
        downloadUrl: 'https://example.com/download/qrcode.png',
      },
    });
  } catch (err) {
    next(err);
  }
});

// Konversi Satuan
// GET /api/utility/konversi?from=km&to=m&value=5
router.get('/konversi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, value } = req.query;

    if (!from || !to || !value) {
      res.status(400).json({
        success: false,
        message: 'from, to, and value parameters are required',
      });
      return;
    }

    const conversionRates: { [key: string]: { [key: string]: number } } = {
      km: { m: 1000, cm: 100000, mm: 1000000 },
      m: { km: 0.001, cm: 100, mm: 1000 },
      kg: { g: 1000, mg: 1000000, lb: 2.20462 },
      celsius: { fahrenheit: (val: number) => (val * 9/5) + 32, kelvin: (val: number) => val + 273.15 },
    };

    const result = typeof conversionRates[from as string]?.[to as string] === 'function'
      ? (conversionRates[from as string][to as string] as any)(parseFloat(value as string))
      : parseFloat(value as string) * (conversionRates[from as string]?.[to as string] || 1);

    res.json({
      success: true,
      data: {
        from: from,
        to: to,
        originalValue: parseFloat(value as string),
        convertedValue: result,
        formula: `${value} ${from} = ${result} ${to}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Translasi
// POST /api/utility/translasi
router.post('/translasi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targetLanguage = 'en' } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: 'Text is required for translation',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        originalText: text,
        targetLanguage: targetLanguage,
        translatedText: 'Translation result here',
        detectedLanguage: 'id',
        supportedLanguages: ['id', 'en', 'es', 'fr', 'de', 'zh', 'ja'],
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
