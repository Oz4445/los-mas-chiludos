export default function Footer(){
  return (
    <footer style={{borderTop:'1px solid var(--border)',background:'#fff',marginTop:24}}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',gap:12}}>
        <p style={{margin:0}}>© {new Date().getFullYear()} Los Más Chiludos</p>
        <p style={{margin:0}}>Horario: Lun–Dom 12:00–22:00</p>
      </div>
    </footer>
  );
}
