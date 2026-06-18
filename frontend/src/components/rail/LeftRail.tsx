function LeftRail() {
  const nickname = localStorage.getItem("userNickname") || "Študent";
  const email = localStorage.getItem("userEmail") || "";
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname || email}`;

  return (
    <aside className="rail rail-left">
      <div className="rail-card welcome-card">
        <div className="welcome-banner"></div>
        <img src={avatar} alt="avatar" className="welcome-avatar" />
        <p className="welcome-hi">Vitaj späť,</p>
        <h3 className="welcome-name">{nickname}</h3>
        <p className="welcome-sub">Pekný deň na učenie</p>
      </div>

      <div className="rail-card">
        <h4 className="rail-title"><i className="fa-solid fa-compass"></i> Ako to funguje</h4>
        <ol className="rail-steps">
          <li><span className="step-num">1</span> Polož otázku alebo zdieľaj problém</li>
          <li><span className="step-num">2</span> Komunita ti odpovie v komentároch</li>
          <li><span className="step-num">3</span> Užitočné príspevky označ srdiečkom</li>
        </ol>
      </div>
    </aside>
  );
}

export default LeftRail;
