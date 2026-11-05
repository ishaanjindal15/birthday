import "./stars.css";

function Stars() {

  const stars = [];

  for (let i = 0; i < 150; i++) {

    const size =
      Math.random() < 0.7
        ? "small"
        : Math.random() < 0.9
        ? "medium"
        : "large";

    stars.push(
      <span
        key={i}
        className={`star ${size}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    );
  }

  return <div className="stars">{stars}</div>;
}

export default Stars;