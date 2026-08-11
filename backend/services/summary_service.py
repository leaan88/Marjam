import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
import anthropic

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


class SummaryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def generate_daily_summary(self) -> dict:
        today = datetime.now(timezone.utc).date().isoformat()

        # Fetch today's data from MongoDB
        shared_cursor = self.db.shared_tracks.find({"shared_at_date": today})
        shared_tracks = await shared_cursor.to_list(length=100)

        feedback_cursor = self.db.track_feedback.find({"created_at_date": today})
        feedbacks = await feedback_cursor.to_list(length=200)

        gens_cursor = self.db.generations.find({"created_at_date": today})
        generations = await gens_cursor.to_list(length=100)

        stats = {
            "shared_tracks": len(shared_tracks),
            "feedbacks": len(feedbacks),
            "generations": len(generations),
        }

        if stats["shared_tracks"] == 0 and stats["generations"] == 0:
            summary_text = "No activity today yet — be the first to generate and share a track!"
        else:
            prompt = _build_summary_prompt(today, shared_tracks, feedbacks, generations, stats)
            message = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=600,
                messages=[{"role": "user", "content": prompt}],
            )
            summary_text = message.content[0].text

        result = {
            "date": today,
            "summary": summary_text,
            "stats": stats,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

        await self.db.daily_summaries.replace_one(
            {"date": today}, result, upsert=True
        )

        return {"success": True, **result}

    async def get_daily_summary(self, date: str | None = None) -> dict:
        target = date or datetime.now(timezone.utc).date().isoformat()
        doc = await self.db.daily_summaries.find_one({"date": target})
        if doc:
            doc.pop("_id", None)
            return {"success": True, **doc}
        return {"success": False, "error": "No summary found for this date", "date": target}


def _build_summary_prompt(date, shared_tracks, feedbacks, generations, stats):
    moods = [g.get("mood", "") for g in generations if g.get("mood")]
    mood_counts = {}
    for m in moods:
        mood_counts[m] = mood_counts.get(m, 0) + 1
    top_moods = sorted(mood_counts, key=mood_counts.get, reverse=True)[:3]

    prompts_sample = [g.get("prompt", "")[:80] for g in generations if g.get("prompt")][:5]
    feedback_sample = [f.get("text", "")[:80] for f in feedbacks if f.get("text")][:5]

    return f"""You are a music community analyst for Marjam, an AI music loop platform.
Write a short, energetic daily summary for {date} in 3-4 sentences.
Highlight what the community created, trending moods, and any interesting feedback.
Keep it warm and motivating — like a creative journal entry for producers.

Stats:
- Tracks generated: {stats['generations']}
- Tracks shared: {stats['shared_tracks']}
- Community feedbacks: {stats['feedbacks']}
- Top moods: {', '.join(top_moods) if top_moods else 'mixed'}

Sample prompts used today:
{chr(10).join(f'- {p}' for p in prompts_sample) if prompts_sample else '- (none yet)'}

Sample community feedback:
{chr(10).join(f'- {f}' for f in feedback_sample) if feedback_sample else '- (none yet)'}

Write the summary now:"""
