"use client";

const achievements = [
  { id: "curved_ramp", name: "CURVED_RAMP_CLEARED", unlocked: true, icon: "[]" },
  { id: "blue_zone", name: "BLUE_ZONE_SHOT", unlocked: true, icon: "[]" },
  { id: "under_60", name: "UNDER_60_SECONDS", unlocked: true, icon: "[]" },
  { id: "zero_resets", name: "ZERO_RESETS", unlocked: false, icon: "[]" },
  { id: "perfect_run", name: "PERFECT_RUN", unlocked: false, icon: "[]" },
  { id: "sharpshooter", name: "SHARPSHOOTER", unlocked: true, icon: "[]" },
];

export default function AchievementsPage() {
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 text-[#00ff00]/50 text-sm">{">"} ACHIEVEMENTS [{unlocked}/{achievements.length}]</div>

      <div className="terminal-box p-4">
        <pre className="text-sm">
{`╔════════════════════════════════════════╗
║           BADGE COLLECTION             ║
╠════════════════════════════════════════╣`}
        </pre>

        {achievements.map((a) => (
          <div
            key={a.id}
            className={`py-2 px-2 border-b border-[#00ff00]/10 ${
              a.unlocked ? "text-[#00ff00]" : "text-[#00ff00]/30"
            }`}
          >
            {a.unlocked ? "[X]" : "[ ]"} {a.name}
            {a.unlocked && <span className="text-[#ffb000] ml-2">★</span>}
          </div>
        ))}

        <pre className="text-sm mt-2">
{`╚════════════════════════════════════════╝`}
        </pre>

        <div className="mt-4 text-xs text-[#00ff00]/40">
          {"> "}Unlocked badges can be minted as NFTs on Solana
        </div>
      </div>
    </div>
  );
}
