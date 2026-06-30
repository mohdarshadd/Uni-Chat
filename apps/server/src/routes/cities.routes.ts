import { Router, type Request, type Response } from 'express';
import { City } from '../models/City.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const cities = await City.find({ isActive: true })
    .populate({
      path: 'stateId',
      populate: { path: 'countryId' },
    })
    .lean();

  const mapped = cities.map((city) => ({
    id: city._id.toString(),
    name: city.name,
    stateId: city.stateId?._id?.toString() ?? '',
    stateName: (city.stateId as any)?.name ?? '',
    countryId: (city.stateId as any)?.countryId?._id?.toString() ?? '',
    countryName: (city.stateId as any)?.countryId?.name ?? '',
    universityCount: 0,
  }));

  res.json(mapped);
});

export { router as citiesRoutes };
