import { CardArt } from "@/components/CardArt"
import type { Project } from "@/data/projects"

type ProjectCardProps = {
  project: Project
  mini?: boolean
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, mini, onOpen }: ProjectCardProps) {
  const body = project.claim ?? project.d
  const method = project.method

  return (
    <div
      className={`card${project.feat ? " keycard" : ""}${mini ? " mini" : ""}`}
    >
      <button
        type="button"
        className="card-hit"
        onClick={() => onOpen(project)}
      >
        <div className="card-art">
          <CardArt kind={project.art} />
        </div>
        <p className="t">{project.t}</p>
        <p className="tag">{project.tag || ""}</p>
        {body ? <p className="d">{body}</p> : null}
        {method && method !== body ? <p className="d method">{method}</p> : null}
      </button>
      {project.github ? (
        <a
          className="card-gh"
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      ) : null}
    </div>
  )
}
