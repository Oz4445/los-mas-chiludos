export default function Section({title, subtitle, children}) {
  return (
    <section className="section">
      <div className="container">
        {title && <h2 style={{margin:'0 0 6px'}}>{title}</h2>}
        {subtitle && <p style={{margin:'0 0 18px',opacity:.8}}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
