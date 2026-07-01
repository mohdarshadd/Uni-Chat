import { Poll, type IPoll } from '../models/Poll.js';
import { v4 as uuid } from 'uuid';

export interface PollResponse {
  id: string;
  roomId: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: string[];
    voterCount: number;
  }[];
  createdBy: string;
  createdByName: string;
  totalVotes: number;
  isClosed: boolean;
  createdAt: string;
  expiresAt: string;
}

function toResponse(poll: IPoll): PollResponse {
  return {
    id: poll._id.toString(),
    roomId: poll.roomId.toString(),
    question: poll.question,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      votes: o.votes,
      voterCount: o.votes.length,
    })),
    createdBy: poll.createdBy,
    createdByName: poll.createdByName,
    totalVotes: poll.options.reduce((sum, o) => sum + o.votes.length, 0),
    isClosed: poll.isClosed,
    createdAt: poll.createdAt.toISOString(),
    expiresAt: poll.expiresAt.toISOString(),
  };
}

export async function createPoll(input: {
  roomId: string;
  question: string;
  options: string[];
  createdBy: string;
  createdByName: string;
}): Promise<PollResponse> {
  const poll = new Poll({
    roomId: input.roomId,
    question: input.question,
    options: input.options.map((text) => ({
      id: uuid(),
      text,
      votes: [],
    })),
    createdBy: input.createdBy,
    createdByName: input.createdByName,
  });

  await poll.save();
  return toResponse(poll);
}

export async function votePoll(
  pollId: string,
  optionId: string,
  userId: string,
): Promise<PollResponse | null> {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;
  if (poll.isClosed) return null;
  if (new Date() > poll.expiresAt) {
    poll.isClosed = true;
    await poll.save();
    return null;
  }

  // Remove user's existing vote from all options
  for (const opt of poll.options) {
    const idx = opt.votes.indexOf(userId);
    if (idx !== -1) opt.votes.splice(idx, 1);
  }

  // Add vote to selected option
  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return null;

  option.votes.push(userId);
  await poll.save();

  return toResponse(poll);
}

export async function getRoomPolls(roomId: string): Promise<PollResponse[]> {
  const polls = await Poll.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return polls.map((p: any) => toResponse(p as IPoll));
}

export async function closePoll(pollId: string): Promise<boolean> {
  const result = await Poll.findByIdAndUpdate(pollId, { isClosed: true });
  return result !== null;
}
