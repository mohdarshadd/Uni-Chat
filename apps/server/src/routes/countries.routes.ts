import { Router, type Request, type Response } from 'express';
import { Country } from '../models/Country.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;

  const filter: Record<string, unknown> = { isActive: true };
  if (search && typeof search === 'string') {
    filter.name = { $regex: search, $options: 'i' };
  }

  const countries = await Country.find(filter).sort({ name: 1 }).lean();

  const mapped = countries.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    code: c.code,
  }));

  res.json(mapped);
});

export { router as countriesRoutes };
