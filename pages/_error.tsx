function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>{statusCode || 'Hiba'}</h1>
      <p>{statusCode === 404 ? 'Az oldal nem található.' : 'Valami hiba történt.'}</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
