type Stats = { posts: number; likes: number; comments: number };

const TIPS = [
  "Učenie v krátkych blokoch s prestávkami zvyšuje sústredenie.",
  "Vysvetli látku niekomu inému — najlepšie odhalíš svoje medzery.",
  "Píš si poznámky vlastnými slovami, nie doslovne.",
  "Striedaj predmety, mozog si lepšie pamätá pestrý obsah.",
  "Spánok pred skúškou je dôležitejší než ponocovanie.",
  "Dobre položená otázka je polovica odpovede.",
  "Veľkú úlohu rozdeľ na malé kroky a oslavuj každý pokrok.",
];

function RightRail({ stats }: { stats: Stats }) {
  const tip = TIPS[new Date().getDay() % TIPS.length];

  return (
    <aside className="rail rail-right">
      <div className="rail-card">
        <h4 className="rail-title"><i className="fa-solid fa-chart-simple"></i> Komunita</h4>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-num">{stats.posts}</span>
            <span className="stat-label">príspevkov</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.likes}</span>
            <span className="stat-label">páči sa</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.comments}</span>
            <span className="stat-label">komentárov</span>
          </div>
        </div>
      </div>

      <div className="rail-card tip-card">
        <h4 className="rail-title"><i className="fa-solid fa-lightbulb"></i> Tip dňa</h4>
        <p className="tip-text">{tip}</p>
      </div>

      <div className="rail-card">
        <h4 className="rail-title"><i className="fa-solid fa-keyboard"></i> Skratky</h4>
        <div className="shortcut-row">
          <span className="shortcut-keys"><kbd>↑</kbd><kbd>↓</kbd></span>
          <span className="shortcut-desc">Prechádzaj príspevky</span>
        </div>
        <div className="shortcut-row">
          <span className="shortcut-keys"><kbd>Esc</kbd></span>
          <span className="shortcut-desc">Zatvor komentáre</span>
        </div>
      </div>
    </aside>
  );
}

export default RightRail;
