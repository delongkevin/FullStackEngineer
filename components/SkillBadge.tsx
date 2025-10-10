interface SkillBadgeProps {
  skill: string;
  level?: number;
}

export default function SkillBadge({ skill, level }: SkillBadgeProps) {
  return (
    <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
      <span>{skill}</span>
      {level && (
        <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
          {level}%
        </span>
      )}
    </div>
  );
}