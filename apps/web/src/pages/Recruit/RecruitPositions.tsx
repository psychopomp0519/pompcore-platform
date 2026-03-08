/**
 * 모집 포지션 카드 그리드
 * - recruitment.ts 데이터 기반 자동 렌더링
 * - DynamicIcon으로 SVG 아이콘 표시
 */
import { RECRUIT_POSITIONS } from '../../constants/recruitment';
import { DynamicIcon } from '../../components/icons/Icons';

export default function RecruitPositions() {
  return (
    <>
      <h2 className="font-display text-xl font-bold text-[#1A1A2E] dark:text-white mb-6">
        모집 포지션
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {RECRUIT_POSITIONS.map((pos) => (
          <div
            key={pos.id}
            className="rounded-2xl p-6 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] transition-all duration-300 hover:border-[#7C3AED]/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#7C3AED] dark:text-[#A78BFA]">
                <DynamicIcon name={pos.icon} size={24} fallback={pos.icon} />
              </span>
              <h3 className="font-display text-base font-bold text-[#1A1A2E] dark:text-white">
                {pos.title}
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-2">
                주요 업무
              </p>
              <ul className="space-y-1.5">
                {pos.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-1.5 text-xs text-[#4A4270] dark:text-[#7A6A9A]">
                    <span className="text-[#7C3AED] text-[10px] mt-0.5">•</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-2">
                이런 분이면 좋겠어요
              </p>
              <ul className="space-y-1.5">
                {pos.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-1.5 text-xs text-[#4A4270] dark:text-[#7A6A9A]">
                    <span className="text-[#FFD700] text-[10px] mt-0.5">✦</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
