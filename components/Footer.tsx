export default function Footer() {
  return (
    <footer 
      className="relative z-10 border-t-2 py-6 mt-20" 
      style={{ 
        backgroundColor: '#0a0a0a',
        borderColor: '#8b0000'
      }}
    >
      <div className="container mx-auto text-center">
        <p 
          className="text-sm" 
          style={{ 
            fontFamily: 'var(--font-cinzel)',
            color: 'rgba(192, 192, 192, 0.7)'
          }}
        >
          © Film Lovers Are Sick People — A Shrine to Cinema&apos;s Madness
        </p>
        <p 
          className="text-xs mt-2" 
          style={{ color: 'rgba(192, 192, 192, 0.5)' }}
        >
          All frames are property of their respective copyright holders.
        </p>
      </div>
    </footer>
  );
}
