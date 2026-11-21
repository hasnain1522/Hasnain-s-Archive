import { useEffect, useState } from "react";
import { HACKATHONS, PROJECTS } from "../../data/projectData";
import "../../styles/projects.css";

function ProjectRecord({ item, index, onSelect }) {
  return <button type="button" className="project-record" style={{ "--delay": `${index * 100}ms` }} onClick={() => onSelect(item.id)}><span className="record-number">[{item.id}]</span><span className="record-main"><span className="record-type">{item.type || item.event}</span><strong>{item.name}</strong><span>{item.summary}</span>{item.participation && <span className="record-participation">{item.participation}</span>}</span><span className="record-status"><i />{item.status}</span><span className="record-arrow">↗</span></button>;
}

export default function Projects({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [booted, setBooted] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); const timer = window.setTimeout(() => setBooted(true), 180); return () => window.clearTimeout(timer); }, []);
  const allRecords = [...PROJECTS, ...HACKATHONS];
  const record = allRecords.find((item) => item.id === selected);

  if (record) return <main className="projects-interface project-detail-view"><header className="projects-header"><button type="button" className="projects-back" onClick={() => setSelected(null)}>← DATABASE</button><span>PROJECT DATABASE / {record.id}</span></header><section className="project-detail"><div className="project-detail-kicker">{record.classification || record.event} / {record.type || "HACKATHON BUILD"}</div><div className="project-detail-title-row"><span className="project-index">[{record.id}]</span><h1>{record.name}</h1></div><p className="project-detail-description">{record.description}</p><div className="project-detail-grid"><div><span className="hud-label">SYSTEM SUMMARY</span><p>{record.summary}</p></div><div><span className="hud-label">STATUS</span><strong>{record.status}</strong></div><div><span className="hud-label">TECH CORE</span><div className="tech-list">{record.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div>{record.participation && <section className="project-participation"><span className="hud-label">HACKATHON PARTICIPATION</span><p>{record.participation}</p></section>}{record.hackathonDetails && <section className="hackathon-detail-panel">
  <div className="hud-label">COMPETITION RECORD / PARTICIPATION DETAILS</div>
  <div className="hackathon-facts">
    <article><span>FORMAT</span><strong>{record.hackathonDetails.format}</strong></article>
    {record.hackathonDetails.participationType && <article><span>PARTICIPATION</span><strong>{record.hackathonDetails.participationType}</strong></article>}
    {record.hackathonDetails.nextStage && <article><span>NEXT STAGE</span><strong>{record.hackathonDetails.nextStage}</strong></article>}
    <article><span>OUTCOME</span><strong>{record.hackathonDetails.outcome}</strong></article>
    {record.hackathonDetails.timeline && <article><span>TIMELINE</span><strong>{record.hackathonDetails.timeline}</strong></article>}
  </div>
  <div className="hackathon-story">
    {["context","challenge","solution","implementation","developmentContext","learning","recordNote"].filter((key)=>record.hackathonDetails[key]).map((key,index)=><article key={key}><span>{["CONTEXT","CHALLENGE","PROJECT APPROACH","IMPLEMENTATION","DEVELOPMENT CONTEXT","LEARNING & EXPERIENCE","DOCUMENTATION NOTE"][["context","challenge","solution","implementation","developmentContext","learning","recordNote"].indexOf(key)]}</span><p>{record.hackathonDetails[key]}</p></article>)}
  </div>
</section>}{record.training && <section className="project-training">
  <div className="hud-label">LEARNING CONTEXT / BOOTCAMP</div>
  <div className="training-heading"><h2>{record.training.title}</h2><span>{record.training.duration}</span></div>
  <strong className="training-provider">{record.training.provider}</strong>
  <p>{record.training.context}</p>
  <p>{record.training.learning}</p>
  <p className="training-note">{record.training.acknowledgement}</p>
</section>}
{record.features && <section className="project-info-section">
  <div className="hud-label">CAPABILITIES / CHATBOT FEATURES</div>
  <div className="project-chip-grid">{record.features.map((feature,index)=><span key={feature}><b>{String(index+1).padStart(2,"0")}</b>{feature}</span>)}</div>
</section>}
{record.implementation && <section className="project-info-section">
  <div className="hud-label">HOW THE CHATBOT WORKS</div>
  <div className="project-step-list">{record.implementation.map((step,index)=><article key={step}><span>{String(index+1).padStart(2,"0")}</span><p>{step}</p></article>)}</div>
</section>}
{record.environment && <section className="project-info-section">
  <div className="hud-label">DEVELOPMENT ENVIRONMENT</div>
  <div className="tech-list">{record.environment.map((item)=><span key={item}>{item}</span>)}</div>
</section>}
{record.runGuide && <section className="project-info-section">
  <div className="hud-label">RUN THE PROJECT / QUICK START</div>
  <div className="project-step-list">{record.runGuide.map((step,index)=><article key={step}><span>{String(index+1).padStart(2,"0")}</span><p>{step}</p></article>)}</div>
</section>}
{record.sampleConversation && <section className="project-info-section conversation-section">
  <div className="hud-label">SAMPLE CONVERSATION / TERMINAL PREVIEW</div>
  <div className="terminal-conversation">{record.sampleConversation.map((line,index)=><div key={index} className={line.speaker==="BOT"?"bot-line":"user-line"}><b>{line.speaker==="BOT"?"BOT":"YOU"}</b><span>{line.message}</span></div>)}</div>
</section>}
{record.acknowledgement && <section className="project-info-section acknowledgement-section">
  <div className="hud-label">ACKNOWLEDGEMENT</div>
  <p>Special thanks to <strong>{record.acknowledgement.organization}</strong> for organizing the bootcamp and providing an opportunity to learn and practise introductory AI/ML concepts.</p>
  <p>Grateful to <a href={record.acknowledgement.mentorProfile} target="_blank" rel="noreferrer">{record.acknowledgement.mentor}</a> for the teaching and guidance during the bootcamp.</p>
</section>}
{record.learningOutcomes && <section className="project-info-section">
  <div className="hud-label">CONCEPTS PRACTISED / LEARNING OUTCOMES</div>
  <div className="project-chip-grid learning-chips">{record.learningOutcomes.map((item,index)=><span key={item}><b>{String(index+1).padStart(2,"0")}</b>{item}</span>)}</div>
</section>}
{record.limitations && <section className="project-limitations">
  <div className="hud-label">SCOPE &amp; TECHNICAL LIMITATIONS</div>
  <ul>{record.limitations.map((item)=><li key={item}>{item}</li>)}</ul>
</section>}
<section className="project-evolution"><div className="hud-label">BUILD EVOLUTION / WHAT CAME NEXT</div><div className="evolution-line">{record.evolution.map((step,index)=><article key={step}><span>{String(index+1).padStart(2,"0")}</span><p>{step.replace(/^\d+\s—\s/,"")}</p></article>)}</div></section><div className="project-links"><a href={record.repository} target="_blank" rel="noreferrer">OPEN REPOSITORY ↗</a>{record.snapshot&&<a href={record.snapshot} target="_blank" rel="noreferrer">OPEN SNAPSHOT ↗</a>}</div></section><footer className="projects-footer"><span className="archive-signature">Hasnain&apos;s Archive</span></footer></main>;

  return <main className="projects-interface"><div className="project-scanline"/><header className="projects-header"><button type="button" className="projects-back" onClick={onBack}>← COMMAND CENTER</button></header><section className={`projects-hero ${booted?"booted":""}`}><div className="database-code">SYS://PROJECT_INDEX/ACCESS_GRANTED</div><h1>PROJECT<br/><span>DATABASE</span></h1><div className="database-telemetry"><span>PROJECT BUILDS <b>{String(PROJECTS.length).padStart(2,"0")}</b></span><span>HACKATHON BUILDS <b>{String(HACKATHONS.length).padStart(2,"0")}</b></span><span>MODE <b>LIVE</b></span></div></section><section className={`project-list ${booted?"booted":""}`}><div className="database-section-label"><span>01 / PROJECTS</span><span>CHRONOLOGICAL BUILD LINE</span></div>{PROJECTS.map((item,index)=><ProjectRecord key={item.id} item={item} index={index} onSelect={setSelected}/>)}<div className="database-section-label hackathon-label"><span>02 / HACKATHON BUILDS</span><span>PROJECTS BUILT UNDER COMPETITION</span></div>{HACKATHONS.map((item,index)=><ProjectRecord key={item.id} item={item} index={PROJECTS.length+index} onSelect={setSelected}/>)}</section><footer className="projects-footer"><span className="archive-signature">Hasnain&apos;s Archive</span><span>SELECT RECORD TO INITIALIZE DETAIL VIEW</span></footer></main>;
}