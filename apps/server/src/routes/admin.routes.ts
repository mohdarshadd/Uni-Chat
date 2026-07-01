import { Router, type Request, type Response } from 'express';
import { University } from '../models/University.js';
import { City } from '../models/City.js';
import { State } from '../models/State.js';
import { Country } from '../models/Country.js';
import { Message } from '../models/Message.js';
import { Report } from '../models/Report.js';
import { AnonymousUser } from '../models/AnonymousUser.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPendingReports, resolveReport } from '../services/report.service.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(adminAuth);

// ─── Dashboard Analytics ─────────────────────────────────
router.get('/analytics', async (_req: Request, res: Response) => {
  const [totalMessages, totalUsers, totalUniversities, totalReports, activeToday] =
    await Promise.all([
      Message.countDocuments(),
      AnonymousUser.countDocuments(),
      University.countDocuments({ isActive: true }),
      Report.countDocuments({ status: 'pending' }),
      AnonymousUser.countDocuments({
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

  res.json({
    totalMessages,
    totalUsers,
    totalUniversities,
    totalReports,
    activeToday,
  });
});

// ─── Reports ──────────────────────────────────────────────
router.get('/reports', async (_req: Request, res: Response) => {
  const reports = await getPendingReports();
  res.json(reports);
});

router.patch('/reports/:id', async (req: Request, res: Response) => {
  const { action } = req.body;
  if (!['dismiss', 'delete_message', 'mute_user'].includes(action)) {
    throw new AppError(400, 'Invalid action', 'INVALID_ACTION');
  }

  const success = await resolveReport(req.params.id as string, action);
  if (!success) throw new AppError(404, 'Report not found', 'NOT_FOUND');

  res.json({ success: true });
});

// ─── Universities ─────────────────────────────────────────
router.get('/universities', async (req: Request, res: Response) => {
  const { cityId, search } = req.query;
  const filter: Record<string, unknown> = {};

  if (cityId) filter.cityId = cityId;
  if (search && typeof search === 'string') {
    filter.name = { $regex: search, $options: 'i' };
  }

  const universities = await University.find(filter)
    .sort({ name: 1 })
    .lean();

  res.json(universities.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    cityId: u.cityId.toString(),
    isActive: u.isActive,
    memberCount: u.memberCount,
  })));
});

router.post('/universities', async (req: Request, res: Response) => {
  const { name, cityId } = req.body;
  if (!name || !cityId) {
    throw new AppError(400, 'Name and cityId are required', 'INVALID_INPUT');
  }

  const city = await City.findById(cityId);
  if (!city) throw new AppError(404, 'City not found', 'NOT_FOUND');

  const university = new University({
    name,
    cityId: city._id,
    stateId: city.stateId,
    countryId: city.countryId,
  });

  await university.save();
  res.json({ success: true, id: university._id.toString() });
});

router.patch('/universities/:id', async (req: Request, res: Response) => {
  const { name, isActive } = req.body;
  const update: Record<string, unknown> = {};
  if (name) update.name = name;
  if (typeof isActive === 'boolean') update.isActive = isActive;

  const result = await University.findByIdAndUpdate(req.params.id as string, update);
  if (!result) throw new AppError(404, 'University not found', 'NOT_FOUND');

  res.json({ success: true });
});

router.delete('/universities/:id', async (req: Request, res: Response) => {
  const result = await University.findByIdAndDelete(req.params.id as string);
  if (!result) throw new AppError(404, 'University not found', 'NOT_FOUND');

  await Message.deleteMany({ roomId: req.params.id });

  res.json({ success: true });
});

// ─── Cities ───────────────────────────────────────────────
router.get('/cities', async (_req: Request, res: Response) => {
  const cities = await City.find()
    .populate({ path: 'stateId', populate: { path: 'countryId' } })
    .sort({ name: 1 })
    .lean();

  res.json(cities.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    stateId: c.stateId?._id?.toString() ?? '',
    stateName: (c.stateId as any)?.name ?? '',
    countryName: (c.stateId as any)?.countryId?.name ?? '',
    isActive: c.isActive,
  })));
});

router.post('/cities', async (req: Request, res: Response) => {
  const { name, stateId } = req.body;
  if (!name || !stateId) {
    throw new AppError(400, 'Name and stateId are required', 'INVALID_INPUT');
  }

  const state = await State.findById(stateId);
  if (!state) throw new AppError(404, 'State not found', 'NOT_FOUND');

  const city = new City({ name, stateId: state._id, countryId: state.countryId });
  await city.save();
  res.json({ success: true, id: city._id.toString() });
});

router.delete('/cities/:id', async (req: Request, res: Response) => {
  const result = await City.findByIdAndDelete(req.params.id as string);
  if (!result) throw new AppError(404, 'City not found', 'NOT_FOUND');

  await University.deleteMany({ cityId: req.params.id });

  res.json({ success: true });
});

// ─── Announcements ─────────────────────────────────────────
router.post('/announcements', async (req: Request, res: Response) => {
  const { roomId, content } = req.body;
  if (!roomId || !content) {
    throw new AppError(400, 'roomId and content required', 'INVALID_INPUT');
  }

  const university = await University.findById(roomId);
  if (!university) throw new AppError(404, 'University not found', 'NOT_FOUND');

  const { createAnnouncement } = await import('../services/announcement.service.js');
  const announcement = createAnnouncement({
    roomId,
    content,
    createdBy: 'admin',
    createdByName: 'Admin',
  });

  const { io } = await import('../socket/index.js');
  if (io) {
    io.to(roomId).emit('announcement:new', {
      content: announcement.content,
      createdByName: announcement.createdByName,
      createdAt: announcement.createdAt,
    });
  }

  res.json({ success: true, announcement });
});

// ─── Active Users / Rooms ─────────────────────────────────
router.get('/rooms', async (_req: Request, res: Response) => {
  const universities = await University.find({ isActive: true })
    .select('name memberCount')
    .sort({ memberCount: -1 })
    .limit(100)
    .lean();

  res.json(universities.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    memberCount: u.memberCount,
  })));
});

export { router as adminRoutes };
