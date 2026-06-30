import { Router, type Request, type Response } from 'express';
import { University } from '../models/University.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { cityId, search } = req.query;

  const filter: Record<string, unknown> = { isActive: true };
  if (cityId) filter.cityId = cityId;
  if (search && typeof search === 'string') {
    filter.name = { $regex: search, $options: 'i' };
  }

  const universities = await University.find(filter)
    .sort({ memberCount: -1 })
    .limit(50)
    .lean();

  const mapped = universities.map((uni) => ({
    id: uni._id.toString(),
    name: uni.name,
    cityId: uni.cityId.toString(),
    cityName: '',
    isActive: uni.isActive,
    memberCount: uni.memberCount,
  }));

  res.json(mapped);
});

export { router as universitiesRoutes };
