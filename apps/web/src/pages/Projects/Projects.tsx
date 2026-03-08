/**
 * 프로젝트 허브 페이지
 * - 모든 서브 프로젝트를 한 눈에 보여주는 페이지
 * - 카테고리별 필터링 가능 (향후 확장)
 */
import { PROJECTS } from '../../constants/projects';
import ProjectCard from '../../components/project/ProjectCard';

export default function Projects() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* 페이지 헤더 */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">프로젝트</span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          PompCore의 모든 서비스를 확인하세요.
          각 프로젝트는 하나의 PompCore 계정으로 이용할 수 있습니다.
        </p>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
