import Heatmap from '../components/Heatmap'
import RiseText from '../components/RiseText'
import ScrambleText from '../components/ScrambleText'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <section id="proof" data-section="proof" className="section dashboard">
      <div className="container">
        <div className="section-head">
          <ScrambleText as="p" className="mono-label" text="Proof of work — 004" />
          <RiseText as="h2" className="display-lg" text="Always shipping." />
          <div className="rule" />
        </div>

        <div className="dash-panels">
          <div className="dash-panel">
            <p className="mono-label">GitHub activity</p>
            <Heatmap />
          </div>
        </div>
      </div>
    </section>
  )
}
